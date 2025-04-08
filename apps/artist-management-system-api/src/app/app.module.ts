import { Module } from '@nestjs/common';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { AppConfigModule } from '@/config/config.module';
import { TransformResponseInterceptor } from '@/common/interceptors/transform-response.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [AppConfigModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
  ],
})
export class AppModule {}
