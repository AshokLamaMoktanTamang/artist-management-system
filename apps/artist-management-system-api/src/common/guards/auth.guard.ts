import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AccessTokenGuard } from './access-token.guard';
import { Reflector } from '@nestjs/core';
import { AUTH_TYPE_KEY } from '../decorators/auth.decorator';
import { AuthType } from '../interfaces/auth-type.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  private static readonly defaultAuthType = AuthType.Bearer;

  private readonly authTypeMap: Record<AuthType, CanActivate | CanActivate[]> =
    {
      [AuthType.Bearer]: this.accessTokenGuard,
      [AuthType.None]: {
        canActivate: () => true,
      },
    };

  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypes = this.reflector.getAllAndOverride(AUTH_TYPE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) ?? [AuthGuard.defaultAuthType];

    const guards = authTypes
      .map((type: AuthType) => this.authTypeMap[type])
      .flat();

    let defaultError = new UnauthorizedException();

    for (const instance of guards) {
      try {
        const canActivate = await instance.canActivate(context);
        if (canActivate) return true;
      } catch (error) {
        defaultError = error as UnauthorizedException;
      }
    }
    throw defaultError;
  }
}
