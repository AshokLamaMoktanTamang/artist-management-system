import { Redis } from 'ioredis';
import { Global, Module, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';

import { IORedisKey } from './redis.constants';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [
    {
      provide: IORedisKey,
      useFactory: async (configService: ConfigService) => {
        const redisOptions = {
          port: configService.get('redis.port'),
          host: configService.get('redis.host'),
          keyPrefix: configService.get('redis.keyPrefix'),
        };
        return new Redis(redisOptions);
      },
      inject: [ConfigService],
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule implements OnApplicationShutdown {
  constructor(private readonly moduleRef: ModuleRef) {}

  async onApplicationShutdown(signal?: string): Promise<void> {
    return new Promise<void>((resolve) => {
      const redis = this.moduleRef.get(IORedisKey);
      redis.quit();
      redis.on('end', () => {
        resolve();
      });
    });
  }
}
