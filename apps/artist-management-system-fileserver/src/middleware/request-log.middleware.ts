import { Request, Response, NextFunction } from 'express';
import { Logger } from '../logger';

export function requestLoggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const logger = new Logger('HTTP');

  const { method, originalUrl } = req;

  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const contentLength = res.getHeader('content-length') || '';
    const statusCode = res.statusCode;

    const logMessage = `${method} ${originalUrl} ${statusCode} content-length: ${contentLength} time: ${duration}ms`;

    if (statusCode >= 500) {
      logger.error(logMessage);
    } else if (duration > 200 || statusCode >= 400) {
      logger.warn(logMessage);
    } else {
      logger.info(logMessage);
    }
  });

  next();
}
