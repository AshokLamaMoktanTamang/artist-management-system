import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as crypto from 'crypto';
import * as fs from 'fs-extra';
import { env } from './config';

export class FileServer {
  private fileDirectory: string;
  private publicUrlBase: string;
  private secretKey: string;

  constructor() {
    this.fileDirectory = env.STORAGE_DIR;
    this.publicUrlBase = env.FILE_SERVER_HOST + '/' + this.fileDirectory;
    this.secretKey = env.FILE_SERVER_SECRET;

    fs.ensureDirSync(path.join(__dirname, this.fileDirectory));
  }

  private generateSignature(data: string): string {
    return crypto
      .createHmac('sha256', this.secretKey)
      .update(data)
      .digest('hex');
  }

  generatePresignedUrl({
    fileName,
    fileType,
    maxSize,
    bucketName = '',
  }: {
    fileName?: string;
    fileType: string;
    maxSize: number;
    bucketName?: string;
  }): { fileKey: string; url: string } {
    const allowedFileTypes = ['image/jpeg', 'image/png', '.xlsx'];
    if (!allowedFileTypes.includes(fileType)) {
      throw new Error('Invalid file type');
    }

    if (maxSize <= 0 || maxSize > 10 * 1024 * 1024) {
      throw new Error('Invalid file size limit');
    }

    const fileKey = `${uuidv4()}-${fileName}`;
    const expirationTime = 5 * 60 * 1000;
    const expirationTimestamp = Date.now() + expirationTime;

    const dataToSign = `${fileKey}|${expirationTimestamp}|${fileType}|${maxSize}|${bucketName}`;
    const signature = this.generateSignature(dataToSign);

    const presignedUrl = `/${fileKey}?${
      bucketName ? `bucket=${bucketName}&` : ''
    }expires=${expirationTimestamp}&fileType=${fileType}&maxSize=${maxSize}&signature=${signature}`;

    const publicUrl = `${this.publicUrlBase}${presignedUrl}`;
    const filePath = bucketName ? `${bucketName}/${fileKey}` : fileKey;

    return { url: publicUrl, fileKey: filePath };
  }

  validatePresignedUrl(url: string): {
    fileKey: string;
    valid: boolean;
    fileType: string;
    maxSize: number;
    bucketName?: string;
  } {
    const urlParts = url.split('?');
    const fileKey = urlParts[0].replace(`/${env.STORAGE_DIR}/`, '');
    const params = new URLSearchParams(urlParts[1]);

    const expires = params.get('expires');
    const expirationTimestamp = parseInt(expires ?? '0', 10);

    const fileType = params.get('fileType') || '';
    const maxSize = parseInt(params.get('maxSize') || '0', 10);
    const signature = params.get('signature') || '';
    const bucketName = params.get('bucket') || '';

    const dataToSign = `${fileKey}|${expirationTimestamp}|${fileType}|${maxSize}|${bucketName}`;
    const expectedSignature = this.generateSignature(dataToSign);

    const isExpired = Date.now() > expirationTimestamp;
    const isValidSignature = signature === expectedSignature;

    return {
      fileKey,
      valid: !isExpired && isValidSignature,
      fileType,
      maxSize,
      bucketName,
    };
  }

  validateFileSize(fileSize: number, maxSize: number): boolean {
    return fileSize <= maxSize;
  }

  async handleFileUpload(
    fileKey: string,
    filePath: string,
    fileType: string,
    maxSize: number,
    bucketName?: string
  ): Promise<string> {
    try {
      const fullPath = bucketName
        ? path.join(this.fileDirectory, bucketName, fileKey)
        : path.join(this.fileDirectory, fileKey);

      const destPath = path.dirname(fullPath);
      await fs.ensureDir(destPath);

      const fileExtension = path.extname(fileKey).toLowerCase();
      const allowedExtensions: Record<string, string> = {
        'image/jpeg': '.jpg',
        'image/png': '.png',
        '.xlsx': '.xlsx',
      };

      console.log({ fileType, fileExtension });
      if (
        allowedExtensions[fileType] &&
        allowedExtensions[fileType] !== fileExtension
      ) {
        throw new Error('Invalid file extension');
      }

      const fileStats = await fs.stat(filePath);
      if (!this.validateFileSize(fileStats.size, maxSize)) {
        throw new Error('File size exceeds the allowed limit');
      }

      await fs.rename(filePath, fullPath);
      return fullPath;
    } catch (error) {
      fs.remove(filePath);
      throw error;
    }
  }
}
