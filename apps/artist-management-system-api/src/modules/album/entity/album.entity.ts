import { BaseEntity } from '@/common/entity/base.entity';
import { TimeStampEntity } from '@/common/entity/timeStamp.entity';

export interface AlbumEntity {
  title: string;
  release_date?: Date;
  genre?: string;
  user_id: string;
  is_draft: boolean;
  cover?: string;
}

export interface Album extends BaseEntity, AlbumEntity, TimeStampEntity {}

export const albumTable = 'album';
