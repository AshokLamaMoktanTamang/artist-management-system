import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { AlbumController } from './album.contoller';
import { AlbumService } from './album.service';
import { AlbumRepository } from './album.repository';

@Module({
  imports: [HttpModule],
  controllers: [AlbumController],
  providers: [AlbumService, AlbumRepository],
})
export class AlbumModule {}
