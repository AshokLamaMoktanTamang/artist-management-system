import { Injectable, NotFoundException } from '@nestjs/common';
import { MusicRepository } from './music.repository';
import { ICreateMusic, IGeneratePresigneMusic } from './interfaces';
import { firstValueFrom } from 'rxjs';
import { PaginationQueryDto } from '@/common/dto/pagination/pagination-query.dto';
import { PaginationDto } from '@/common/dto/pagination/pagination.dto';
import { PaginationResponseDto } from '@/common/dto/response/pagination-response.dto';

@Injectable()
export class MusicService extends MusicRepository {
  async createMusic(data: ICreateMusic) {
    const { title, user_id, cover, genre } = data;

    const music = await this.create({
      is_draft: true,
      title,
      user_id,
      cover,
      genre,
    });

    return music;
  }

  async generatePresignedUrlForMusicCover({
    user_id,
    ...data
  }: IGeneratePresigneMusic) {
    const baseURL = this.configService.get<string>('assets.baseUrl');
    const { data: presignedData } = await firstValueFrom(
      this.httpService.post(
        `generate-presigned-url`,
        { ...data, maxSize: 10 * 1024 * 1024, bucketName: `music/${user_id}` },
        { baseURL }
      )
    );

    return presignedData;
  }

  async getMusicOfUser(
    user_id: string,
    { limit = 10, page = 1 }: PaginationQueryDto
  ) {
    page = Math.max(0, page - 1);

    const filetrQuery = { user_id };

    const [totalMusics, albums] = await Promise.all([
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
      totalMusics,
      Math.ceil(totalMusics / limit),
      page
    );
    const paginatedMusicResponse = new PaginationResponseDto(
      albums,
      pagination
    );

    return paginatedMusicResponse;
  }

  async deleteMusic(albumId: string, userId: string) {
    const albumDetail = await this.findById(albumId);

    if (!albumId || albumDetail?.user_id !== userId) {
      throw new NotFoundException('Music not found');
    }

    await this.deleteById(albumId);

    return 'Music deleted successfully!';
  }
}
