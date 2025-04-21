import {
  CreateMusicDto,
  GenerateMusicPresignedUrlDto,
  UpdateMusicDto,
} from '../dto/music.dto';

export interface ICreateMusic extends CreateMusicDto {
  user_id: string;
}

export interface IGeneratePresigneMusic extends GenerateMusicPresignedUrlDto {
  user_id: string;
}

export interface IUpdateMusic extends UpdateMusicDto {
  musicId: string;
  userId: string
}
