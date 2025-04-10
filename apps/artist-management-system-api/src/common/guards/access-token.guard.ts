import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { REQUEST_USER_KEY } from '@/common/constants/requests.constant';
import { IActiveUserData } from '@/common/interfaces/active-user-data.interface';
import { PasetoService } from '@/modules/paseto/paseto.service';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private readonly pasetoService: PasetoService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    try {
      const payload = (await this.pasetoService.verifyToken(
        token
      )) as IActiveUserData;

      request[REQUEST_USER_KEY] = payload;
    } catch (e: any) {
      throw new UnauthorizedException(e.message || 'Token error');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
