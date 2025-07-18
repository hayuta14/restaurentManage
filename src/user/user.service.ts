import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDTO } from 'src/auth/dto/createUserDTO';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ){}

  async create(createUserDto: CreateUserDTO): Promise<String> {
    try{
      const isExist = await this.userRepository.findOne({where: {username: createUserDto.username}});
      if(isExist){
        throw new BadRequestException('User already exists');
      }
      const user = this.userRepository.create(createUserDto);
      await this.userRepository.save(user);
      return 'This action adds a new user';
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(email: string): Promise<User> {
    const user = await this.userRepository.findOne({where: {username: email}});
    if(!user){
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const {username, password} = updateUserDto;
    const user = await this.userRepository.findOne({where: {id:id.toString()}});
    if(!user){
      throw new NotFoundException('User not found');
    }
    user.username = username || user.username;
    user.password = password || user.password;
    await this.userRepository.save(user);
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
