import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { MusicService } from './music.service';
import { Roles } from '@/common/decorators/roles.decorator';
import { USER_ROLE } from '../users/interfaces';
import { ActiveUser } from '@/common/decorators/active-user.decorator';
import { CreateMusicDto, GenerateMusicPresignedUrlDto } from './dto/music.dto';
import { PaginationQueryDto } from '@/common/dto/pagination/pagination-query.dto';

@Controller('music')
@Roles(USER_ROLE.ARTIST)
export class MusicController {
  constructor(private readonly albumService: MusicService) {}

  @Post()
  async createMusic(
    @ActiveUser('id') user_id: string,
    @Body() createMusicDto: CreateMusicDto
  ) {
    return this.albumService.createMusic({ ...createMusicDto, user_id });
  }

  @Post('/presigned-url')
  async generatePresignedData(
    @ActiveUser('id') user_id: string,
    @Body() presignedData: GenerateMusicPresignedUrlDto
  ) {
    return this.albumService.generatePresignedUrlForMusicCover({
      ...presignedData,
      user_id,
    });
  }

  @Get()
  async getAllMusics(
    @ActiveUser('id') user_id: string,
    @Query() paginationData: PaginationQueryDto
  ) {
    return this.albumService.getMusicOfUser(user_id, paginationData);
  }

  @Delete(':id')
  async deleteMusic(
    @Param('id') id: string,
    @ActiveUser('id') user_id: string,
  ) {
    return this.albumService.deleteMusic(id, user_id);
  }
}
