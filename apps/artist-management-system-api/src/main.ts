import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app/app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, RequestMethod, ValidationPipe } from '@nestjs/common';

import { AllExceptionFilter } from '@/common/filters/exception.filter';

(async () => {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const { port = 3000, allowedOrigins = [] } =
    config.get<{ port?: number; allowedOrigins?: Array<string> }>('app') || {};

  app.enableCors({
    origin: (originUrl, callback) => {
      if (
        !originUrl ||
        allowedOrigins.some((x) => originUrl.endsWith(x.trim()))
      ) {
        callback(null, true)
      } else {
        callback(new Error(`${originUrl} not allowed by CORS`))
      }
    },
  });

  app.setGlobalPrefix('api', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
})();
