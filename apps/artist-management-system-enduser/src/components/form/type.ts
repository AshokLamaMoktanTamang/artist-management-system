import { DetailedHTMLProps, FormHTMLAttributes, ReactNode } from 'react';
import { FieldValues, UseFormProps } from 'react-hook-form';

export interface HookFormProps
  extends Omit<
    DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>,
    'onSubmit'
  > {
  onSubmit?: (value: any) => Promise<void> | void;
}

export interface HookFormProviderProps
  extends UseFormProps<FieldValues, Record<string, unknown>> {
  children?: ReactNode;
}
