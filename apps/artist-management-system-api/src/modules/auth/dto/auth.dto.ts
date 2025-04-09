import { passwordValidationRegex } from '@/common/constants/reges.constant';
import { UserEntity } from '@/modules/users/entity/user.entity';
import { USER_GENDER, USER_ROLE } from '@/modules/users/interfaces';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class SignupDto implements UserEntity {
  @MaxLength(150)
  @IsString()
  @IsNotEmpty()
  first_name!: string;

  @MaxLength(150)
  @IsString()
  @IsNotEmpty()
  last_name!: string;

  @IsEmail()
  email!: string;

  @Matches(passwordValidationRegex, {
    message: 'Invalid Password',
  })
  password!: string;

  @IsPhoneNumber('NP')
  phone!: string;

  @IsDate()
  dob!: Date;

  @IsEnum(USER_ROLE)
  role!: USER_ROLE;

  @IsEnum(USER_GENDER)
  gender!: USER_GENDER;
}
