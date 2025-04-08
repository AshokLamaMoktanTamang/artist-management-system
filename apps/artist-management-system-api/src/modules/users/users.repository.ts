import { Inject, Injectable } from '@nestjs/common';
import { User, userTable } from './entity/user.entity';
import { DatabaseService } from '../database/database.service';
import { BaseRepository } from '@/common/repositories/base.repository';
import { userSchema } from './entity/user.schema';

@Injectable()
export class UsersRepository extends BaseRepository<User> {
  constructor(@Inject() databaseService: DatabaseService) {
    super(databaseService, userTable, userSchema, true);
  }
}
