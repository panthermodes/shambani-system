export class UserResponseDto {
  success: boolean;
  message: string;
  data?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    role: string;
    farmName?: string | null;
    businessName?: string | null;
    location?: string | null;
    region?: string | null;
    district?: string | null;
    isActive: boolean;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
  error?: string;
}

export class UsersListResponseDto {
  success: boolean;
  message: string;
  data?: Array<{
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    role: string;
    farmName?: string | null;
    businessName?: string | null;
    location?: string | null;
    region?: string | null;
    district?: string | null;
    isActive: boolean;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
  }>;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  error?: string;
}