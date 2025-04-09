import { toastError } from './toast';

const errorMessageHandler = (errObject: any) => {
  if (!errObject?.isSuccess && errObject?.message)
    return toastError(
      Array.isArray(errObject?.message)
        ? errObject?.message[0]
        : errObject?.message
    );

  return toastError('Something went wrong!');
};

export default errorMessageHandler;
