import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginDto, SignupDto } from './dto/auth.dto';
import { comparePassword } from '@/utils/bcrypt';
import { IGenerateToken } from './interfaces';
import { PasetoService } from '../paseto/paseto.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly pasetoService: PasetoService
  ) {}

  private async generateToken(data: IGenerateToken) {
    const [accessToken, refreshToken] = await Promise.all([
      this.pasetoService.generateToken(data),
      this.pasetoService.generateToken(data, { expiresIn: '6 hours' }),
    ]);

    return { accessToken, refreshToken };
  }

  async registerUser(data: SignupDto) {
    const { email, role } = data;
    const existingUser = await this.usersService.findOne({ email, role });

    if (existingUser)
      throw new ConflictException('User with role already exist');

    return this.usersService.create(data);
  }

  async login({ email, password, role }: LoginDto) {
    const user = await this.usersService.findOne({ email, role });

    if (!user) throw new UnauthorizedException('Invalid Credentials!');

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    return this.generateToken(user);
  }
}
