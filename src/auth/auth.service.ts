import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDTO, LoginDTO } from './dto/createUserDTO';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDTO: CreateUserDTO): Promise<{ message: string }> {
    try {
      createUserDTO.password = await bcrypt.hash(createUserDTO.password, 10);
      const result = await this.userService.create(createUserDTO);
      this.logger.log(`User registered: ${createUserDTO.username}`);
      return result;
    } catch (error) {
      this.logger.error(
        `Registration failed for ${createUserDTO.username}: ${error.message}`,
      );
      throw error;
    }
  }

  async login(loginDTO: LoginDTO): Promise<string> {
    try {
      const { username, password } = loginDTO;
      const user = await this.userService.findOne(username, true);
      if (!user) {
        this.logger.warn(`Login failed: user not found - ${username}`);
        throw new UnauthorizedException('Invalid credentials');
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        this.logger.warn(`Login failed: wrong password for user - ${username}`);
        throw new UnauthorizedException('Invalid credentials');
      }
      const payload = { username: user.username, role: user.role };
      const token = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN,
      });
      this.logger.log(`User logged in: ${username}`);
      return token;
    } catch (error) {
      this.logger.error(
        `Login error for ${loginDTO.username}: ${error.message}`,
      );
      throw new UnauthorizedException(error.message);
    }
  }
}
