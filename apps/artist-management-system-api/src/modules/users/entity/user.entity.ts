import { BaseEntity } from '@/common/entity/base.entity';
import { USER_GENDER, USER_ROLE } from '../interfaces';

export interface UserEntity {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
  dob: Date;
  gender: USER_GENDER;
  role: USER_ROLE;
  avatar?: string;
}

export interface User extends BaseEntity, UserEntity {}

export const userTable = 'users';
