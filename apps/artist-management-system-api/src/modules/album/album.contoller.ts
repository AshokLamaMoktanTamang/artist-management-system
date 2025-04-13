import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { AlbumService } from './album.service';
import { Roles } from '@/common/decorators/roles.decorator';
import { USER_ROLE } from '../users/interfaces';
import { ActiveUser } from '@/common/decorators/active-user.decorator';
import { CreateAlbumDto, GenerateAlbumPresignedUrlDto } from './dto/album.dto';
import { PaginationQueryDto } from '@/common/dto/pagination/pagination-query.dto';

@Controller('album')
@Roles(USER_ROLE.ARTIST)
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  async createAlbum(
    @ActiveUser('id') user_id: string,
    @Body() createAlbumDto: CreateAlbumDto
  ) {
    return this.albumService.createAlbum({ ...createAlbumDto, user_id });
  }

  @Post('/presigned-url')
  async generatePresignedData(
    @ActiveUser('id') user_id: string,
    @Body() presignedData: GenerateAlbumPresignedUrlDto
  ) {
    return this.albumService.generatePresignedUrlForAlbumCover({
      ...presignedData,
      user_id,
    });
  }

  @Get()
  async getAllAlbums(
    @ActiveUser('id') user_id: string,
    @Query() paginationData: PaginationQueryDto
  ) {
    return this.albumService.getAlbumOfUser(user_id, paginationData);
  }

  @Delete(':id')
  async deleteAlbum(
    @Param('id') id: string,
    @ActiveUser('id') user_id: string,
  ) {
    return this.albumService.deleteAlbum(id, user_id);
  }
}
