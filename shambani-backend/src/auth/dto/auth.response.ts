export class AuthResponseDto {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      phone: string | null;
      role: string;
      farmName: string | null;
      businessName: string | null;
      location: string | null;
      region: string | null;
      district: string | null;
      isActive: boolean;
      isVerified: boolean;
      createdAt: Date;
      updatedAt: Date;
    };
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
  error?: string;
}

export class UserResponseDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: string;
  farmName: string | null;
  businessName: string | null;
  location: string | null;
  region: string | null;
  district: string | null;
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class OtpResponseDto {
  success: boolean;
  message: string;
  data?: {
    otpSessionId: string;
    expiresAt: Date;
  };
  error?: string;
}