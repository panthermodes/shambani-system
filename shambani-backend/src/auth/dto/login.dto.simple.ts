// Simple login DTOs without decorators for immediate compilation
export class LoginDto {
  email?: string;
  phone?: string;
  username?: string;
  password!: string;
}

export class LoginWithPhoneDto {
  phone!: string;
  password!: string;
}

export class RequestOtpDto {
  phone!: string;
}

export class VerifyOtpDto {
  phone!: string;
  code!: string;
}
