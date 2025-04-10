import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { REQUEST_USER_KEY } from '@/common/constants/requests.constant';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles) return true;

    const user = context.switchToHttp().getRequest()[REQUEST_USER_KEY];

    const roleExists = roles.some((role) => user.role === role);

    if (!roleExists)
      throw new UnauthorizedException(
        `User with role ${user.role} is not allowed to access this resource`,
      );

    return roleExists;
  }
}
