import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let repo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(repo, 'create')
        .mockReturnValue({
          username: 'test',
          password: 'hashed',
          role: 'user',
          created_at: new Date(),
          dishes: [],
        } as any);
      jest
        .spyOn(repo, 'save')
        .mockResolvedValue({
          username: 'test',
          password: 'hashed',
          role: 'user',
          created_at: new Date(),
          dishes: [],
        } as any);

      const result = await service.create({
        username: 'test',
        password: '123',
        role: 'user',
      } as any);
      expect(result).toEqual({ message: 'User created successfully' });
    });

    it('should throw if user exists', async () => {
      jest
        .spyOn(repo, 'findOne')
        .mockResolvedValue({ username: 'test' } as any);
      await expect(
        service.create({
          username: 'test',
          password: '123',
          role: 'user',
        } as any),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
