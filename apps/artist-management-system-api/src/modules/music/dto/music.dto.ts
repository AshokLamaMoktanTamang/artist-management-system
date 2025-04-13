import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { MusicEntity } from '../entity/music.entity';

export class CreateMusicDto implements Omit<MusicEntity, 'user_id'> {
  @IsString()
  @IsOptional()
  cover?: string;

  @IsString()
  @IsOptional()
  genre?: string;

  @IsBoolean()
  @IsOptional()
  is_draft!: boolean;

  @IsDate()
  @ValidateIf((data) => data.is_draft !== undefined && !data.is_draft)
  release_date?: Date;

  @IsString()
  @IsNotEmpty()
  title!: string;
}

export class GenerateMusicPresignedUrlDto {
  @IsString()
  @IsNotEmpty()
  fileName!: string;

  @IsString()
  @IsNotEmpty()
  fileType!: string;
}
