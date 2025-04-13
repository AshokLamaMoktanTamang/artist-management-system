import { Injectable, NotFoundException } from '@nestjs/common';
import { AlbumRepository } from './album.repository';
import { ICreateAlbum, IGeneratePresigneAlbum } from './interfaces';
import { firstValueFrom } from 'rxjs';
import { PaginationQueryDto } from '@/common/dto/pagination/pagination-query.dto';
import { PaginationDto } from '@/common/dto/pagination/pagination.dto';
import { PaginationResponseDto } from '@/common/dto/response/pagination-response.dto';

@Injectable()
export class AlbumService extends AlbumRepository {
  async createAlbum(data: ICreateAlbum) {
    const { title, user_id, cover, genre } = data;

    const album = await this.create({
      is_draft: true,
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

  async getAlbumOfUser(
    user_id: string,
    { limit = 10, page = 1 }: PaginationQueryDto
  ) {
    page = Math.max(0, page - 1);

    const filetrQuery = { user_id };

    const [totalAlbums, albums] = await Promise.all([
      this.count(filetrQuery),
      this.find({
        where: filetrQuery,
        limit,
        offset: limit * page,
        orderBy: 'created_at',
        orderDirection: 'DESC',
      }),
    ]);
    const pagination = new PaginationDto(
      totalAlbums,
      Math.ceil(totalAlbums / limit),
      page
    );
    const paginatedAlbumResponse = new PaginationResponseDto(
      albums,
      pagination
    );

    return paginatedAlbumResponse;
  }

  async deleteAlbum(albumId: string, userId: string) {
    const albumDetail = await this.findById(albumId);

    if (!albumId || albumDetail?.user_id !== userId) {
      throw new NotFoundException('Album not found');
    }

    await this.deleteById(albumId);

    return 'Album deleted successfully!';
  }
}
