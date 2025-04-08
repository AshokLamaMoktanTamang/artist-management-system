import { Module } from '@nestjs/common';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { AppConfigModule } from '@/modules/config/config.module';
import { TransformResponseInterceptor } from '@/common/interceptors/transform-response.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DatabaseModule } from '@/modules/database/database.module';
import { UsersModule } from '@/modules/users/users.module';
import { AuthModule } from '@/modules/auth/auth.module';

@Module({
  imports: [AppConfigModule, DatabaseModule, UsersModule, AuthModule],
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
