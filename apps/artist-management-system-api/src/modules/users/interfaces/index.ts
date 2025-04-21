import { SignupDto } from '@/modules/auth/dto/auth.dto';

export enum USER_GENDER {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum USER_ROLE {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ARTIST_MANAGER = 'ARTIST_MANAGER',
  ARTIST = 'ARTIST',
}

export interface IUpdateUser extends Partial<SignupDto> {
  userId: string;
}
