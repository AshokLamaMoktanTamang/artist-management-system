import { USER_GENDER, USER_ROLE } from '@/types';
import { Pagination } from '@shared/@types';

export type LoginPayload = {
  email: string;
  password: string;
  role: USER_ROLE;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

export type UserDetail = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  dob: string;
  gender: USER_GENDER;
  role: USER_ROLE;
  full_name: string;
  avatar?: string;
};

export interface IBasePresignedUrlResponse {
  url: string;
  fileKey: string;
}

export interface IAddAlbumPayload {
  title: string;
  genre: string;
  cover?: string;
}

export interface IGetAlbumsPayload {
  page: number;
  limit: number;
}

export type Album = {
  id: string;
  title: string;
  release_date: null | string;
  genre: string;
  user_id: string;
  is_draft: boolean;
  cover: string | null;
  created_at: string;
  updated_at: string;
  deleted: boolean;
  deleted_at: string | null;
};

export interface IGetAlbumsResponse {
  data: Array<Album>;
  pagination: Pagination;
}
