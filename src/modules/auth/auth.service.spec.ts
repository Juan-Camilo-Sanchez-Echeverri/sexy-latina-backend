import { Test, TestingModule } from '@nestjs/testing';

import { UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { bcryptAdapter } from '@common/adapters';

import { UsersService } from '@modules/users/users.service';

import { AuthService } from './auth.service';
import { EmailRequestService } from '@modules/email-request/email-request.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Partial<Record<keyof UsersService, jest.Mock>>;
  let jwtService: Partial<Record<keyof JwtService, jest.Mock>>;
  let emailRequestService: Partial<
    Record<keyof EmailRequestService, jest.Mock>
  >;

  beforeEach(async () => {
    usersService = {
      findOneBy: jest.fn(),
    };
    jwtService = {
      signAsync: jest.fn(),
      verifyAsync: jest.fn(),
    };
    emailRequestService = {
      create: jest.fn(),
      validate: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
        { provide: EmailRequestService, useValue: emailRequestService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return access and refresh tokens when credentials are valid', async () => {
      const loginDto = { email: 'test@gmail.com', password: 'plain' };
      const hashedPassword = await bcryptAdapter.hash('plain');
      const mockUser = {
        _id: 'user1',
        password: hashedPassword,
        roles: ['user'],
      };

      usersService.findOneBy!.mockResolvedValue(mockUser);
      (jest.spyOn(bcryptAdapter, 'compare') as jest.Mock).mockResolvedValue(
        true,
      );
      jwtService.signAsync!.mockResolvedValueOnce('access_token');

      const result = await service.login(loginDto);

      expect(result).toEqual({ accessToken: 'access_token' });

      expect(usersService.findOneBy).toHaveBeenCalledWith({
        email: 'test@gmail.com',
      });

      expect(jwtService.signAsync).toHaveBeenCalledTimes(1);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      usersService.findOneBy!.mockResolvedValue(null);

      await expect(
        service.login({ email: 'test@gmail.com', password: 'plain' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      const mockUser = { password: 'hashed' };
      usersService.findOneBy!.mockResolvedValue(mockUser);
      (jest.spyOn(bcryptAdapter, 'compare') as jest.Mock).mockResolvedValue(
        false,
      );

      await expect(
        service.login({ email: 'test@gmail.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
