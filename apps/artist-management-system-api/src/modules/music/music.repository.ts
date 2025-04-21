import { BaseRepository } from '@/common/repositories/base.repository';
import { Inject, Injectable } from '@nestjs/common';
import { Music, musicTable } from './entity/music.entity';
import { DatabaseService } from '../database/database.service';
import { musicIndexes, musicSchema } from './entity/music.schema';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MusicRepository extends BaseRepository<Music> {
  constructor(
    @Inject() databaseService: DatabaseService,
    protected readonly httpService: HttpService,
    protected readonly configService: ConfigService
  ) {
    super(
      databaseService,
      musicTable,
      musicSchema,
      true,
      musicIndexes,
      async (data, action) => {
        data[action === 'create' ? 'created_at' : 'updated_at'] = new Date();

        return data;
      }
    );
  }
}
