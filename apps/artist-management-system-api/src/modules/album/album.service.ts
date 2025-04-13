import { Injectable } from '@nestjs/common';
import { AlbumRepository } from './album.repository';
import { ICreateAlbum, IGeneratePresigneAlbum } from './interfaces';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AlbumService extends AlbumRepository {
  async createAlbum(data: ICreateAlbum) {
    const { title, user_id, cover, genre } = data;

    const album = await this.create({
      is_draft: false,
      title,
      user_id,
      cover,
      genre,
    });

    return album;
  }

  async generatePresignedUrlForAlbumCover({
    user_id,
    ...data
  }: IGeneratePresigneAlbum) {
    const baseURL = this.configService.get<string>('assets.baseUrl');
    const { data: presignedData } = await firstValueFrom(
      this.httpService.post(
        `generate-presigned-url`,
        { ...data, maxSize: 10 * 1024 * 1024, bucketName: `album/${user_id}` },
        { baseURL }
      )
    );

    return presignedData;
  }
}
