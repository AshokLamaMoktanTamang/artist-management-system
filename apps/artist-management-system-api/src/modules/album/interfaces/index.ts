import { CreateAlbumDto, GenerateAlbumPresignedUrlDto } from '../dto/album.dto';

export interface ICreateAlbum extends CreateAlbumDto {
  user_id: string;
}

export interface IGeneratePresigneAlbum extends GenerateAlbumPresignedUrlDto {
  user_id: string;
}
