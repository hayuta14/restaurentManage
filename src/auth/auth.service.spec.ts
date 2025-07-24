import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a user', async () => {
      (userService.create as jest.Mock).mockResolvedValue({
        message: 'User created successfully',
      });
      const result = await service.register({
        username: 'test',
        password: '123',
        role: 'user',
      } as any);
      expect(result).toEqual({ message: 'User created successfully' });
    });
  });

  describe('login', () => {
    it('should return token for valid credentials', async () => {
      const hashed = await bcrypt.hash('123', 10);
      (userService.findOne as jest.Mock).mockResolvedValue({
        username: 'test',
        password: hashed,
        role: 'user',
      });
      const result = await service.login({
        username: 'test',
        password: '123',
      } as any);
      expect(result).toBe('token');
    });

    it('should throw for invalid credentials', async () => {
      (userService.findOne as jest.Mock).mockResolvedValue(null);
      await expect(
        service.login({ username: 'test', password: 'wrong' } as any),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
