import { UserDetail } from '@/store/types';

export interface IAddUserDialog {
  isEditMode?: boolean;
  defaultValue?: Partial<UserDetail>;
}
