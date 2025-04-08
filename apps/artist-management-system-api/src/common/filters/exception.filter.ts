import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

interface IError {
  message: string;
  isSuccess: boolean;
  error: string;
}

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp(),
      response = ctx.getResponse();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseData =
      exception instanceof HttpException && exception.getResponse()
        ? {
            ...(exception.getResponse() as IError),
            isSuccess: false,
          }
        : {
            message: (exception as Error).message,
            statusCode: status,
            error: (exception as Error).name,
            isSuccess: false,
          };

    const request = ctx.getRequest();
    this.logMessage(request, responseData, status);
    response.status(status).json(responseData);
  }

  private logMessage(
    request: any,
    message: IError,
    status: number,
  ) {
    if (status === 500) {
      Logger.error(
        `End Request for ${request.path}`,
        `method=${request.method} status=${status} message=${
          message.message ? message.message : null
        }`
      );
    } else {
      Logger.warn(
        `End Request for ${request.path}`,
        `method=${request.method} status=${status}  message=${
          message.message ? message.message : null
        }`
      );
    }
  }
}
