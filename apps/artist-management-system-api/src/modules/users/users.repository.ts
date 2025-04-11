import { Inject, Injectable } from '@nestjs/common';
import { User, userTable } from './entity/user.entity';
import { DatabaseService } from '../database/database.service';
import { BaseRepository } from '@/common/repositories/base.repository';
import { userIndexes, userSchema } from './entity/user.schema';
import { hashPassword } from '@/utils/bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class UsersRepository extends BaseRepository<User> {
  constructor(@Inject() databaseService: DatabaseService) {
    super(
      databaseService,
      userTable,
      userSchema,
      true,
      userIndexes,
      async (data, action) => {
        if (action === 'create' && data.email) {
          const md5 = crypto
            .createHash('md5')
            .update(JSON.stringify({ email: data.email, role: data.role }))
            .digest('hex');

          data.avatar = `https://gravatar.com/avatar/${md5}?s=200&d=retro`;
        }

        if (data.password) {
          data.password = await hashPassword(data.password);
        }
        return data;
      },
      (user) => ({
        full_name: `${user.first_name} ${user.last_name}`,
      })
    );
  }
}
