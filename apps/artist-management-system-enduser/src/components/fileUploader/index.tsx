import { ChangeEvent, forwardRef, useState } from 'react';
import { IFileUploader } from './type';
import { HookInputBaseProps } from '@/types';
import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../form';

const FileUploader = forwardRef<HTMLInputElement, IFileUploader>(
  ({ onChange, ...rest }, ref) => {
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const previewUrl = URL.createObjectURL(file);
      onChange?.(file);
      setPreview(previewUrl);
    };

    return (
      <label htmlFor={rest.id} className="block cursor-pointer w-full">
        <input
          ref={ref}
          type="file"
          hidden
          onChange={handleFileChange}
          {...rest}
        />

        <div className="w-full aspect-video bg-primary-foreground border-2 border-dashed border-muted-foreground/40 rounded-xl mt-2 flex items-center justify-center overflow-hidden hover:border-primary transition-all duration-200">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="object-cover w-full h-full transition-all duration-300 rounded-xl"
            />
          ) : (
            <span className="text-muted-foreground text-sm">
              {rest.placeholder || 'Click to upload a file'}
            </span>
          )}
        </div>
      </label>
    );
  }
);

FileUploader.displayName = 'FileUploader';

const HookFileUploader = forwardRef<
  HTMLInputElement,
  IFileUploader & HookInputBaseProps
>((props, ref) => {
  const {
    name,
    label,
    description,
    validate,
    required,
    defaultValue,
    onChange,
  } = props;
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      defaultValue={defaultValue}
      rules={{ validate, required: required && 'Required' }}
      render={({ field: { value, ...field } }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <FileUploader {...props} {...field} ref={ref} onChange={onChange} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
});

export { HookFileUploader, FileUploader };
