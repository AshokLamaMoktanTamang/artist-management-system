import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { AlbumEntity } from '../entity/album.entity';

export class CreateAlbumDto implements Omit<AlbumEntity, 'user_id'> {
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

export class GenerateAlbumPresignedUrlDto {
  @IsString()
  @IsNotEmpty()
  fileName!: string;

  @IsString()
  @IsNotEmpty()
  fileType!: string;
}
