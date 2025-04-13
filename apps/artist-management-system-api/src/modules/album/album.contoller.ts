import { Body, Controller, Post } from '@nestjs/common';
import { AlbumService } from './album.service';
import { Roles } from '@/common/decorators/roles.decorator';
import { USER_ROLE } from '../users/interfaces';
import { ActiveUser } from '@/common/decorators/active-user.decorator';
import { CreateAlbumDto, GenerateAlbumPresignedUrlDto } from './dto/album.dto';

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
    return this.albumService.generatePresignedUrlForAlbumCover({ ...presignedData, user_id });
  }
}
