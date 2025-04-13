import { BaseRepository } from '@/common/repositories/base.repository';
import { Inject, Injectable } from '@nestjs/common';
import { Album, albumTable } from './entity/album.entity';
import { DatabaseService } from '../database/database.service';
import { albumIndexes, albumSchema } from './entity/album.schema';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AlbumRepository extends BaseRepository<Album> {
  constructor(
    @Inject() databaseService: DatabaseService,
    protected readonly httpService: HttpService,
    protected readonly configService: ConfigService
  ) {
    super(
      databaseService,
      albumTable,
      albumSchema,
      true,
      albumIndexes,
      async (data, action) => {
        data[action === 'create' ? 'created_at' : 'updated_at'] = new Date();

        return data;
      }
    );
  }
}
