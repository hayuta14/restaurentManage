import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { CreateUserDTO, LoginDTO } from './dto/createUserDTO';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async register(createUserDTO: CreateUserDTO): Promise<String> {
    createUserDTO.password = await bcrypt.hash(createUserDTO.password, 10);
    return await this.userService.create(createUserDTO);
  }

  async login(loginDTO: LoginDTO): Promise<String> {
    try{
      const {username, password} = loginDTO;
      const user = await this.userService.findOne(username);
      if(!user){
        throw new UnauthorizedException('Invalid credentials');
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if(!isMatch){
        throw new UnauthorizedException('Invalid credentials');
      }
      const payload = {username: user.username, role: user.role};
      return this.jwtService.sign(payload,{secret: process.env.JWT_SECRET,expiresIn: process.env.JWT_EXPIRES_IN});
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
