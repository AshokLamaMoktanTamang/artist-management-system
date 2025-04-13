import { BaseEntity } from '@/common/entity/base.entity';
import { TimeStampEntity } from '@/common/entity/timeStamp.entity';

export interface MusicEntity {
  title: string;
  release_date?: Date;
  genre?: string;
  user_id: string;
  is_draft: boolean;
  cover?: string;
}

export interface Music extends BaseEntity, MusicEntity, TimeStampEntity {}

export const albumTable = 'music';
