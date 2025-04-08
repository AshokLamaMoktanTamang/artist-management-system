import { USER_GENDER, USER_ROLE } from '../interfaces';

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  deleted?: boolean;
  deleted_at?: Date;
  phone: string;
  password: string;
  dob: Date;
  gender: USER_GENDER;
  role: USER_ROLE;
}

export const userTable = 'users';
