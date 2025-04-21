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

export type SignupPayload = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
  dob: Date;
  role: USER_ROLE;
  gender: USER_GENDER;
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

export interface IAddMusicPayload {
  title: string;
  genre: string;
  cover?: string;
  musicId?: string;
}

export interface IGetMusicsPayload {
  page: number;
  limit: number;
}

export type Music = {
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

export interface IGetMusicsResponse {
  data: Array<Music>;
  pagination: Pagination;
}

export type GetUsersPayload = {
  limit?: number;
  page?: number;
};

export interface IGeUsersResponse {
  data: Array<UserDetail>;
  pagination: Pagination;
}

export type DeleteUserPayload = {
  userId: string;
};

export interface IUpdateMusicPayload extends Partial<IAddMusicPayload> {
  musicId: string;
  is_draft?: boolean;
}

export interface IUpdateUserPayload extends Partial<SignupPayload> {
  userId: string;
}
