import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PasetoModule } from '../paseto/paseto.module';

@Module({
  imports: [UsersModule, PasetoModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
