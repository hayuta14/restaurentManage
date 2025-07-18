import { PartialType } from '@nestjs/swagger';
import { CreateUserDTO } from 'src/auth/dto/createUserDTO';

export class UpdateUserDto extends PartialType(CreateUserDTO) {}
