import multer from 'multer';
import express from 'express';

import { env } from './config';
import { Logger } from './logger';
import { FileServer } from './filerServer';
import { requestLoggerMiddleware } from './middleware/request-log.middleware';

(() => {
  const port = env.FILE_SERVER_PORT;
  const host = env.FILE_SERVER_HOST;

  const logger = new Logger('App');
  const app = express();

  const fileServer = new FileServer();

  app.use(express.json());
  app.use(requestLoggerMiddleware);

  const upload = multer({
    dest: env.STORAGE_DIR,
    limits: { fileSize: 10 * 1024 * 1024 },
  });

  app.post('/generate-presigned-url', (req, res) => {
    const { fileName, fileType, maxSize, bucketName } = req.body;

    try {
      if (!fileName || !fileType || !maxSize) {
        return res
          .status(400)
          .json({ error: 'fileName, fileType, and maxSize are required' });
      }

      const { url, fileKey } = fileServer.generatePresignedUrl({
        fileName,
        fileType,
        maxSize,
        bucketName,
      });

      return res.json({
        url,
        fileKey,
      });
    } catch (err: any) {
      logger.debug(`Error generating presigned URL: ${err.message}`);
      return res.status(500).json({ error: err.message });
    }
  });

  app.put(
    `/${env.STORAGE_DIR}/:fileKey`,
    upload.single('file') as any,
    async (req, res) => {
      const fileKey = req.params.fileKey;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      try {
        const filePath = file.path;

        const {
          valid,
          fileType: expectedFileType,
          maxSize: expectedMaxSize,
          bucketName,
        } = fileServer.validatePresignedUrl(req.originalUrl);

        if (!valid) {
          return res
            .status(400)
            .json({ error: 'Invalid or expired presigned URL' });
        }

        if (!fileServer.validateFileSize(file.size, expectedMaxSize)) {
          return res
            .status(400)
            .json({ error: 'File size exceeds the allowed limit' });
        }

        const uploadedFilePath = await fileServer.handleFileUpload(
          fileKey,
          filePath,
          expectedFileType,
          expectedMaxSize,
          bucketName
        );

        return res.json({
          message: 'File uploaded successfully',
          filePath: uploadedFilePath,
        });
      } catch (err: any) {
        logger.debug(`File upload error: ${err.message}`);
        return res.status(500).json({ error: err.message });
      }
    }
  );

  app.use(`/${env.STORAGE_DIR}`, express.static(env.STORAGE_DIR));

  app.listen(port, () => {
    logger.info(`App listening on port ${port} at ${host}`);
  });
})();
