import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// Mock PrismaService
const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};

// Mock JwtService
const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);

    // Reset mocks
    jest.clearAllMocks();
  });

  describe('signup', () => {
    const signupDto = {
      email: 'test@example.com',
      password: 'password123',
      name: '테스트유저',
    };

    // TC-AUTH-001: 이메일 회원가입 성공
    it('should create a new user successfully', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({
        id: 'user-1',
        email: signupDto.email,
        name: signupDto.name,
        createdAt: new Date(),
      });
      mockJwtService.sign.mockReturnValue('mock-jwt-token');

      const result = await service.signup(signupDto);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe(signupDto.email);
      expect(mockPrismaService.user.create).toHaveBeenCalled();
    });

    // TC-AUTH-002: 회원가입 실패 - 중복 이메일
    it('should throw ConflictException for duplicate email', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'existing-user',
        email: signupDto.email,
      });

      await expect(service.signup(signupDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.signup(signupDto)).rejects.toThrow(
        '이미 가입된 이메일입니다',
      );
    });

    it('should hash password before saving', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({
        id: 'user-1',
        email: signupDto.email,
        name: signupDto.name,
      });
      mockJwtService.sign.mockReturnValue('mock-jwt-token');

      await service.signup(signupDto);

      const createCall = mockPrismaService.user.create.mock.calls[0][0];
      expect(createCall.data.password).not.toBe(signupDto.password);
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockUser = {
      id: 'user-1',
      email: loginDto.email,
      name: '테스트유저',
      password: bcrypt.hashSync(loginDto.password, 10),
    };

    // TC-AUTH-003: 이메일 로그인 성공
    it('should login successfully with correct credentials', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('mock-jwt-token');

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe(loginDto.email);
    });

    // TC-AUTH-004: 로그인 실패 - 잘못된 비밀번호
    it('should throw UnauthorizedException for wrong password', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      await expect(
        service.login({ ...loginDto, password: 'wrongpassword' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for non-existent user', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('validateOAuthUser', () => {
    // TC-AUTH-005, TC-AUTH-006: OAuth 로그인
    it('should create new user for first-time OAuth login', async () => {
      const oauthData = {
        provider: 'kakao',
        providerId: 'kakao-123',
        email: 'oauth@example.com',
        name: '카카오유저',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({
        id: 'user-1',
        ...oauthData,
      });
      mockJwtService.sign.mockReturnValue('mock-jwt-token');

      const result = await service.validateOAuthUser(oauthData);

      expect(result).toHaveProperty('accessToken');
      expect(mockPrismaService.user.create).toHaveBeenCalled();
    });

    it('should return existing user for returning OAuth login', async () => {
      const oauthData = {
        provider: 'google',
        providerId: 'google-123',
        email: 'oauth@example.com',
        name: '구글유저',
      };

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'existing-user',
        ...oauthData,
      });
      mockJwtService.sign.mockReturnValue('mock-jwt-token');

      const result = await service.validateOAuthUser(oauthData);

      expect(result).toHaveProperty('accessToken');
      expect(mockPrismaService.user.create).not.toHaveBeenCalled();
    });
  });

  describe('refreshToken', () => {
    // TC-AUTH-008: 토큰 만료 시 자동 갱신
    it('should refresh access token with valid refresh token', async () => {
      const refreshToken = 'valid-refresh-token';
      mockJwtService.verify.mockReturnValue({ sub: 'user-1' });
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
      });
      mockJwtService.sign.mockReturnValue('new-access-token');

      const result = await service.refreshToken(refreshToken);

      expect(result).toHaveProperty('accessToken');
      expect(result.accessToken).toBe('new-access-token');
    });

    it('should throw UnauthorizedException for invalid refresh token', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.refreshToken('invalid-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
