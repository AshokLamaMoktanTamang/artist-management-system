import * as React from 'react';

import { cn } from '@/utils/cn';
import { useFormContext } from 'react-hook-form';
import { HookInputBaseProps } from '@/types';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../form';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

const HookInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<'input'> & HookInputBaseProps
>((props, ref) => {
  const { name, label, description, validate, required, defaultValue } = props;
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      defaultValue={defaultValue}
      rules={{ validate, required: required && 'Required' }}
      render={({ field: { value, onChange, ...field } }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input
              {...props}
              {...field}
              ref={ref}
              value={value || ''}
              onChange={(e) => onChange(e)}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
});

export { Input, HookInput };
