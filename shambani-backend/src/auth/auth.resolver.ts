import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto, LoginWithPhoneDto, RequestOtpDto, VerifyOtpDto } from './dto/login.dto';
import { AuthResponseDto, OtpResponseDto } from './dto/auth.response';
import { AuthResponse, OtpResponse, User } from './dto/graphql.types';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GqlAuthGuard } from './guards/gql-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => User, { name: 'me' })
  @UseGuards(GqlAuthGuard)
  async getMe(@Context() context) {
    const user = context.req.user;
    return user;
  }

  @Query(() => Boolean, { name: 'validateToken' })
  async validateToken(@Args('token') token: string) {
    try {
      await this.authService.validateToken(token);
      return true;
    } catch (error) {
      return false;
    }
  }

  @Mutation(() => AuthResponse, { name: 'register' })
  async register(@Args('input') input: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(input);
  }

  @Mutation(() => AuthResponse, { name: 'login' })
  async login(@Args('input') input: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(input);
  }

  @Mutation(() => AuthResponse, { name: 'loginWithPhone' })
  async loginWithPhone(@Args('input') input: LoginWithPhoneDto): Promise<AuthResponseDto> {
    return this.authService.loginWithPhone(input);
  }

  @Mutation(() => OtpResponse, { name: 'requestOtp' })
  async requestOtp(@Args('input') input: RequestOtpDto): Promise<OtpResponseDto> {
    return this.authService.requestOtp(input);
  }

  @Mutation(() => AuthResponse, { name: 'verifyOtp' })
  async verifyOtp(@Args('input') input: VerifyOtpDto): Promise<AuthResponseDto> {
    return this.authService.verifyOtp(input);
  }

  @Mutation(() => AuthResponse, { name: 'refreshToken' })
  async refreshToken(@Args('input') input: { refreshToken: string }): Promise<AuthResponseDto> {
    return this.authService.refreshToken(input.refreshToken);
  }

  @Mutation(() => Boolean, { name: 'logout' })
  @UseGuards(GqlAuthGuard)
  async logout(@Context() context): Promise<boolean> {
    // Implement logout logic (blacklist token, etc.)
    return true;
  }
}