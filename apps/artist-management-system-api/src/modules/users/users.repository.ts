import { Inject, Injectable } from '@nestjs/common';
import { User, userTable } from './entity/user.entity';
import { DatabaseService } from '../database/database.service';
import { BaseRepository } from '@/common/repositories/base.repository';
import { userIndexes, userSchema } from './entity/user.schema';
import { hashPassword } from '@/utils/hash';

@Injectable()
export class UsersRepository extends BaseRepository<User> {
  constructor(@Inject() databaseService: DatabaseService) {
    super(
      databaseService,
      userTable,
      userSchema,
      true,
      userIndexes,
      async (data) => {
        if (data.password) {
          data.password = await hashPassword(data.password);
        }
        return data;
      }
    );
  }
}
