import { HookInputBaseProps } from '@/types';
import { SelectProps } from '@radix-ui/react-select';
import { ReactNode } from 'react';

export interface IHookSelect
  extends Omit<SelectProps, 'onValueChange' | 'name'>,
    HookInputBaseProps {
  options: Array<{ label: ReactNode; value: string }>;
  placeHolder?: string;
}
