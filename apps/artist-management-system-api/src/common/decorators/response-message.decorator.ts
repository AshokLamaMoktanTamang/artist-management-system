import { SetMetadata } from '@nestjs/common';

export const ResponseMessageKey = 'response';

export const ResponseMessage = (responseMessage: any) =>
  SetMetadata('response', responseMessage);
