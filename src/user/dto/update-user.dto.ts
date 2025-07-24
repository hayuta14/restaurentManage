import { PartialType } from '@nestjs/swagger';
import { CreateUserDTO } from '../../auth/dto/createUserDTO';

export class UpdateUserDto extends PartialType(CreateUserDTO) {}
