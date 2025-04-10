import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { IActiveUserData } from '../interfaces/active-user-data.interface';
import { REQUEST_USER_KEY } from '@/common/constants/requests.constant';

export const ActiveUser = createParamDecorator(
  (field: keyof IActiveUserData, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: IActiveUserData = request[REQUEST_USER_KEY];
    return field ? user?.[field] : user;
  }
);
