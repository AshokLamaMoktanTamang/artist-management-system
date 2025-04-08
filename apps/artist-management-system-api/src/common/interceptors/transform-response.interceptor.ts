import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { PaginationResponseDto } from '../dto/response/pagination-response.dto';
import { Reflector } from '@nestjs/core';
import { ResponseMessageKey } from '../decorators/response-message.decorator';
import { BaseResponseDto } from '../dto/response/base-response.dto';

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const responseMessage = this.reflector.get<string>(
      ResponseMessageKey,
      context.getHandler()
    );
    return next.handle().pipe(
      map((data) => {
        const isPaginationResponse = data instanceof PaginationResponseDto;

        const statusCode = context.switchToHttp().getResponse().statusCode;

        const baseResponse: BaseResponseDto = {
          statusCode,
          isSuccess: true,
          message: responseMessage,
        };

        if (isPaginationResponse) {
          const { data: responseData, pagination } = data;
          return {
            ...baseResponse,
            data: responseData,
            pagination,
          };
        }
        return {
          ...baseResponse,
          data,
        };
      })
    );
  }
}
