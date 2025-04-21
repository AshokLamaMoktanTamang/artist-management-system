import { Music } from '@/store/types';

export interface IAddMusicDialog {
  isEditMode?: boolean;
  defaultValue?: Partial<Music>;
}
