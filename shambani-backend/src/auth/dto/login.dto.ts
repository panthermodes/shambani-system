import { IsEmail, IsNotEmpty, IsString, IsOptional, MinLength, Length } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @MinLength(10, { message: 'Phone must be at least 10 characters' })
  phone?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class LoginWithPhoneDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(10, { message: 'Phone must be at least 10 characters' })
  phone!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class RequestOtpDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(10, { message: 'Phone must be at least 10 characters' })
  phone!: string;
}

export class VerifyOtpDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(10, { message: 'Phone must be at least 10 characters' })
  phone!: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: 'OTP must be exactly 6 characters' })
  code!: string;
}