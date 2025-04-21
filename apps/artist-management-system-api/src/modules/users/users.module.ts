import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { BullModule } from '@nestjs/bullmq';
import { USER_QUEUE } from './constants';
import { UsersProcessor } from './users.processor';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    BullModule.registerQueue({
      name: USER_QUEUE,
      defaultJobOptions: { removeOnComplete: true },
    }),
    HttpModule
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UsersProcessor],
  exports: [UsersService],
})
export class UsersModule {}
