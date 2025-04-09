import { USER_ROLE } from '@/modules/users/interfaces';

export interface IGenerateToken {
  id: string;
  email: string;
  role: USER_ROLE;
}
