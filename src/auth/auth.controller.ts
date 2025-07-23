import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO, LoginDTO } from './dto/createUserDTO';
import { APIResponseDTO } from 'src/common/DTO/APIResponseDTO';
import { ApiResponseWithModel } from 'src/common/decorators/swagger.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiResponseWithModel(String,200)
  async login(@Body() loginDTO: LoginDTO) {
    const token = await this.authService.login(loginDTO);
    return new APIResponseDTO<String>(true, token);
  }

  @Post('register')
  @ApiResponseWithModel(String,201)
  async register(@Body() CreateUserDTO: CreateUserDTO) {
    const user = await this.authService.register(CreateUserDTO);
    return new APIResponseDTO<String>(true, user);
  }
}
