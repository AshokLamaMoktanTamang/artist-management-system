import { ReactNode } from 'react';
import { ValidateResult } from 'react-hook-form';

export interface HookInputBaseProps {
  required?: boolean;
  validate?: (
    value: string | number | boolean | Record<string, any>
  ) => ValidateResult | Promise<ValidateResult>;
  name: string;
  label?: ReactNode;
  description?: ReactNode;
}

export enum USER_ROLE {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ARTIST_MANAGER = 'ARTIST_MANAGER',
  ARTIST = 'ARTIST',
}
