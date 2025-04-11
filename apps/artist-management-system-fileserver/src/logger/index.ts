import pino, { BaseLogger } from 'pino';
import pretty from 'pino-pretty';

export class Logger {
  private readonly logger: BaseLogger;

  constructor(private readonly context?: string) {
    const stream = pretty({
      colorize: true,
      translateTime: 'yyyy-mm-dd HH:MM:ss',
      ignore: 'pid,hostname',
      messageFormat: (log, messageKey) => {
        return `${this.context ? `[${this.context}] ` : ''}${log[messageKey]}`;
      },
    });

    this.logger = pino(stream);
  }

  info(message: string, meta?: Record<string, any>) {
    this.logger.info(meta || {}, message);
  }

  warn(message: string, meta?: Record<string, any>) {
    this.logger.warn(meta || {}, message);
  }

  error(message: string, meta?: Record<string, any>) {
    this.logger.error(meta || {}, message);
  }

  debug(message: string, meta?: Record<string, any>) {
    this.logger.debug(meta || {}, message);
  }

  fatal(message: string, meta?: Record<string, any>) {
    this.logger.fatal(meta || {}, message);
  }
}
