import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class AuthResponse {
  @Field()
  success: boolean;

  @Field({ nullable: true })
  message?: string;

  @Field({ nullable: true })
  accessToken?: string;

  @Field({ nullable: true })
  refreshToken?: string;

  @Field({ nullable: true })
  user?: any; // Replace with proper User type when available
}

@ObjectType()
export class OtpResponse {
  @Field()
  success: boolean;

  @Field()
  message: string;

  @Field({ nullable: true })
  pid?: string;
}

@ObjectType()
export class User {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field({ nullable: true })
  phone?: string;

  @Field()
  role: string;

  @Field({ nullable: true })
  farmName?: string;

  @Field({ nullable: true })
  businessName?: string;

  @Field({ nullable: true })
  location?: string;

  @Field({ nullable: true })
  region?: string;

  @Field({ nullable: true })
  district?: string;

  @Field()
  isActive: boolean;

  @Field()
  isVerified: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
