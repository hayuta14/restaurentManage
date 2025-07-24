import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
  Logger,
} from '@nestjs/common';

import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDTO } from 'src/auth/dto/createUserDTO';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService implements OnModuleInit {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async onModuleInit() {
    const user: Partial<User> = {
      username: 'admin',
      password: await bcrypt.hash('admin', 10),
      role: 'admin',
      created_at: new Date(),
      dishes: [],
    };
    const isExist = await this.userRepository.findOne({
      where: { username: user.username },
    });
    if (!isExist) {
      await this.userRepository.save(user);
    }
  }

  async create(createUserDto: CreateUserDTO): Promise<{ message: string }> {
    try {
      const isExist = await this.userRepository.findOne({
        where: { username: createUserDto.username },
      });
      if (isExist) {
        this.logger.warn(
          `Attempt to create existing user: ${createUserDto.username}`,
        );
        throw new BadRequestException('User already exists');
      }
      // Hash password before saving
      const hashedPassword = await this.hashPassword(createUserDto.password);
      const user = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });
      await this.userRepository.save(user);
      this.logger.log(`User created: ${user.username}`);
      return { message: 'User created successfully' };
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  async findAll(page = 1, limit = 10) {
    try {
      const [users, total] = await this.userRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
      });
      // Loại bỏ password khỏi kết quả trả về
      const usersWithoutPassword = users.map(({ password, ...rest }) => rest);
      return {
        data: usersWithoutPassword,
        total,
        page,
        limit,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(username: string, withPassword: true): Promise<User>;
  async findOne(
    username: string,
    withPassword?: false,
  ): Promise<Omit<User, 'password'>>;
  async findOne(username: string, withPassword = false): Promise<any> {
    try {
      const user = await this.userRepository.findOne({
        where: { username },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      if (withPassword) return user;
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const { username, password } = updateUserDto;
      const user = await this.userRepository.findOne({
        where: { id: id.toString() },
      });
      if (!user) {
        this.logger.warn(`Attempt to update non-existent user: ${id}`);
        throw new NotFoundException('User not found');
      }
      user.username = username || user.username;
      if (password) {
        user.password = await this.hashPassword(password);
      }
      await this.userRepository.save(user);
      this.logger.log(`User updated: ${user.username}`);
      // Loại bỏ password khỏi kết quả trả về
      const { password: pw, ...userWithoutPassword } = user;
      return {
        message: `User #${id} updated successfully`,
        user: userWithoutPassword,
      };
    } catch (error) {
      this.logger.error(`Error updating user #${id}: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: number) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: id.toString() },
      });
      if (!user) {
        this.logger.warn(`Attempt to remove non-existent user: ${id}`);
        throw new NotFoundException('User not found');
      }
      await this.userRepository.remove(user);
      this.logger.log(`User removed: ${user.username}`);
      return { message: `User #${id} removed successfully` };
    } catch (error) {
      this.logger.error(`Error removing user #${id}: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }
}
