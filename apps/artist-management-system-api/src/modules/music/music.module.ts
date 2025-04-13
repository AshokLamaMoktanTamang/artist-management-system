import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { MusicController } from './music.contoller';
import { MusicService } from './music.service';
import { MusicRepository } from './music.repository';

@Module({
  imports: [HttpModule],
  controllers: [MusicController],
  providers: [MusicService, MusicRepository],
})
export class MusicModule {}
