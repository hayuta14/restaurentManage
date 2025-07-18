import { PickType } from "@nestjs/swagger";
import { User } from "src/user/entities/user.entity";

export class CreateUserDTO extends PickType(User, ['username', 'password']){

}

export class LoginDTO extends PickType(User, ['username', 'password']){}