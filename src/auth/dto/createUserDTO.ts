import { PickType } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';

export class CreateUserDTO extends PickType(User, ['username', 'password']) {}

export class LoginDTO extends PickType(User, ['username', 'password']) {}
