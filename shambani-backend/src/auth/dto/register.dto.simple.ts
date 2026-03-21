// Simple DTOs without decorators for immediate compilation
export enum UserRole {
  FARMER = 'FARMER',
  CASUAL_LABOURER = 'CASUAL_LABOURER',
  EXTENSION_OFFICER = 'EXTENSION_OFFICER',
  LOGISTICS_PROVIDER = 'LOGISTICS_PROVIDER',
  AGROVET_OWNER = 'AGROVET_OWNER',
  MACHINERY_DEALER = 'MACHINERY_DEALER',
  BUYER_AGGREGATOR = 'BUYER_AGGREGATOR',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

// Frontend-compatible registration DTO
export class RegisterDto {
  phone!: string;
  password!: string;
  names?: {
    first?: string;
    middle?: string;
    last?: string;
  };
  role?: UserRole;
  farmName?: string;
  businessName?: string;
  location?: string;
  region?: string;
  district?: string;
}

// Backend registration DTO (for admin use)
export class FullRegisterDto {
  email!: string;
  password!: string;
  firstName!: string;
  lastName!: string;
  phone?: string;
  role!: UserRole;
  farmName?: string;
  businessName?: string;
  location?: string;
  region?: string;
  district?: string;
}
