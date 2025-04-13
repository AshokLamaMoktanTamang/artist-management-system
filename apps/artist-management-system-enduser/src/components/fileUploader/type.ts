export interface IFileUploader
  extends Omit<React.ComponentProps<'input'>, 'type' | 'hidden' | 'onChange'> {
  onChange?: (data?: File) => void;
}
