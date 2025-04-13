import { CreateMusicDto, GenerateMusicPresignedUrlDto } from '../dto/music.dto';

export interface ICreateMusic extends CreateMusicDto {
  user_id: string;
}

export interface IGeneratePresigneMusic extends GenerateMusicPresignedUrlDto {
  user_id: string;
}
