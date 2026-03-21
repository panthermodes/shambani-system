import { Injectable, ConflictException, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../database/prisma.service';
import { RegisterDto, UserRole, FullRegisterDto } from './dto/register.dto';
import { LoginDto, LoginWithPhoneDto, RequestOtpDto, VerifyOtpDto } from './dto/login.dto';
import { AuthResponseDto, OtpResponseDto } from './dto/auth.response';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly otpStore = new Map<string, { code: string; expiresAt: Date; attempts: number }>();

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    try {
      // Check if user already exists by email or phone
      const existingUser = await this.prisma.user.findFirst({
        where: {
          OR: [
            { email: registerDto.email },
            ...(registerDto.phone ? [{ phone: registerDto.phone }] : []),
          ],
        },
      });

      if (existingUser) {
        if (existingUser.email === registerDto.email) {
          throw new ConflictException('User with this email already exists');
        }
        if (registerDto.phone && existingUser.phone === registerDto.phone) {
          throw new ConflictException('User with this phone number already exists');
        }
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);

      // Prepare user data with all farmer-specific fields
      const userData: any = {
        email: registerDto.email,
        password: hashedPassword,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        phone: registerDto.phone || null,
        role: registerDto.role || UserRole.FARMER,
        farmName: registerDto.farmName || null,
        businessName: registerDto.businessName || null,
        location: registerDto.village || registerDto.ward || registerDto.district 
          ? `${registerDto.village || ''}, ${registerDto.ward || ''}, ${registerDto.district || ''}` 
          : null,
        region: registerDto.region,
        district: registerDto.district,
        isActive: true,
        isVerified: false,
      };

      // Add optional farmer-specific fields if provided
      if (registerDto.farmerType) userData.farmerType = registerDto.farmerType;
      if (registerDto.farmerCategory) userData.farmerCategory = registerDto.farmerCategory;
      if (registerDto.registrationNumber) userData.registrationNumber = registerDto.registrationNumber;
      if (registerDto.taxId) userData.taxId = registerDto.taxId;
      if (registerDto.yearsOfExperience) userData.yearsOfExperience = registerDto.yearsOfExperience;
      if (registerDto.farmSize) userData.farmSize = registerDto.farmSize;
      if (registerDto.farmSizeUnit) userData.farmSizeUnit = registerDto.farmSizeUnit;
      if (registerDto.crops) userData.crops = registerDto.crops;
      if (registerDto.livestock) userData.livestock = registerDto.livestock;
      if (registerDto.farmingMethods) userData.farmingMethods = registerDto.farmingMethods;
      if (registerDto.certifications) userData.certifications = registerDto.certifications;
      if (registerDto.ward) userData.ward = registerDto.ward;
      if (registerDto.village) userData.village = registerDto.village;
      if (registerDto.street) userData.street = registerDto.street;
      if (registerDto.houseNumber) userData.houseNumber = registerDto.houseNumber;
      if (registerDto.gpsCoordinates) userData.gpsCoordinates = registerDto.gpsCoordinates;
      if (registerDto.dateOfBirth) userData.dateOfBirth = new Date(registerDto.dateOfBirth).toISOString();
      if (registerDto.gender) userData.gender = registerDto.gender;
      if (registerDto.nationalId) userData.nationalId = registerDto.nationalId;
      if (registerDto.alternativePhone) userData.alternativePhone = registerDto.alternativePhone;
      if (registerDto.preferredLanguage) userData.preferredLanguage = registerDto.preferredLanguage;
      if (registerDto.marketingConsent !== undefined) userData.marketingConsent = registerDto.marketingConsent;

      // Create user
      const user = await this.prisma.user.create({
        data: userData,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          farmName: true,
          businessName: true,
          location: true,
          region: true,
          district: true,
          isActive: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true,
          // Include all farmer-specific fields in response
          farmerType: true,
          farmerCategory: true,
          registrationNumber: true,
          taxId: true,
          yearsOfExperience: true,
          farmSize: true,
          farmSizeUnit: true,
          crops: true,
          livestock: true,
          farmingMethods: true,
          certifications: true,
          ward: true,
          village: true,
          street: true,
          houseNumber: true,
          gpsCoordinates: true,
          dateOfBirth: true,
          gender: true,
          nationalId: true,
          alternativePhone: true,
          preferredLanguage: true,
          marketingConsent: true,
        },
      });

      // Generate tokens
      const tokens = await this.generateTokens(user);

      this.logger.log(`User registered successfully: ${user.phone}`);

      return {
        success: true,
        message: 'User registered successfully',
        data: {
          user,
          ...tokens,
        },
      };
    } catch (error) {
      this.logger.error(`Registration failed: ${error.message}`);
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Registration failed. Please try again.');
    }
  }

  // Full registration method for admin use
  async fullRegister(registerDto: FullRegisterDto): Promise<AuthResponseDto> {
    try {
      // Check if user already exists
      const existingUser = await this.prisma.user.findFirst({
        where: {
          OR: [
            { email: registerDto.email },
            { phone: registerDto.phone },
          ],
        },
      });

      if (existingUser) {
        if (existingUser.email === registerDto.email) {
          throw new ConflictException('User with this email already exists');
        }
        if (existingUser.phone === registerDto.phone) {
          throw new ConflictException('User with this phone number already exists');
        }
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);

      // Create user
      const user = await this.prisma.user.create({
        data: {
          email: registerDto.email,
          password: hashedPassword,
          firstName: registerDto.firstName,
          lastName: registerDto.lastName,
          phone: registerDto.phone,
          role: registerDto.role,
          farmName: registerDto.farmName,
          businessName: registerDto.businessName,
          location: registerDto.location,
          region: registerDto.region,
          district: registerDto.district,
          isActive: true,
          isVerified: false,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          farmName: true,
          businessName: true,
          location: true,
          region: true,
          district: true,
          isActive: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      // Generate tokens
      const tokens = await this.generateTokens(user);

      this.logger.log(`User registered successfully: ${user.email}`);

      return {
        success: true,
        message: 'User registered successfully',
        data: {
          user,
          ...tokens,
        },
      };
    } catch (error) {
      this.logger.error(`Registration failed: ${error.message}`);
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Registration failed. Please try again.');
    }
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    try {
      // Find user by email or phone or username
      let user;
      
      if (loginDto.email) {
        // Try email first
        user = await this.prisma.user.findUnique({
          where: { email: loginDto.email },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            role: true,
            farmName: true,
            businessName: true,
            location: true,
            region: true,
            district: true,
            password: true,
            isActive: true,
            isVerified: true,
            createdAt: true,
            updatedAt: true,
          },
        });
      } else if (loginDto.phone) {
        // Try phone
        user = await this.prisma.user.findUnique({
          where: { phone: loginDto.phone },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            role: true,
            farmName: true,
            businessName: true,
            location: true,
            region: true,
            district: true,
            password: true,
            isActive: true,
            isVerified: true,
            createdAt: true,
            updatedAt: true,
          },
        });
      } else if (loginDto.username) {
        // Try username (search by first name or last name)
        user = await this.prisma.user.findFirst({
          where: {
            OR: [
              { firstName: { equals: loginDto.username, mode: 'insensitive' } },
              { lastName: { equals: loginDto.username, mode: 'insensitive' } },
            ],
          },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            role: true,
            farmName: true,
            businessName: true,
            location: true,
            region: true,
            district: true,
            password: true,
            isActive: true,
            isVerified: true,
            createdAt: true,
            updatedAt: true,
          },
        });
      }

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      if (!user.isActive) {
        throw new UnauthorizedException('Account is deactivated');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Remove password from response
      const { password, ...userWithoutPassword } = user;

      // Generate tokens
      const tokens = await this.generateTokens(userWithoutPassword);

      this.logger.log(`User logged in successfully: ${user.email || user.phone}`);

      return {
        success: true,
        message: 'Login successful',
        data: {
          user: userWithoutPassword,
          ...tokens,
        },
      };
    } catch (error) {
      this.logger.error(`Login failed: ${error.message}`);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException('Login failed. Please try again.');
    }
  }

  async loginWithPhone(loginDto: LoginWithPhoneDto): Promise<AuthResponseDto> {
    try {
      // Find user by phone
      const user = await this.prisma.user.findUnique({
        where: { phone: loginDto.phone },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          farmName: true,
          businessName: true,
          location: true,
          region: true,
          district: true,
          password: true,
          isActive: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      if (!user.isActive) {
        throw new UnauthorizedException('Account is deactivated');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Remove password from response
      const { password, ...userWithoutPassword } = user;

      // Generate tokens
      const tokens = await this.generateTokens(userWithoutPassword);

      this.logger.log(`User logged in successfully with phone: ${user.phone}`);

      return {
        success: true,
        message: 'Login successful',
        data: {
          user: userWithoutPassword,
          ...tokens,
        },
      };
    } catch (error) {
      this.logger.error(`Phone login failed: ${error.message}`);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException('Login failed. Please try again.');
    }
  }

  async requestOtp(requestOtpDto: RequestOtpDto): Promise<OtpResponseDto> {
    try {
      // Find user by phone
      const user = await this.prisma.user.findUnique({
        where: { phone: requestOtpDto.phone },
      });

      if (!user) {
        throw new BadRequestException('User with this phone number not found');
      }

      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Store OTP (in production, use Redis or database)
      this.otpStore.set(requestOtpDto.phone, {
        code: otp,
        expiresAt,
        attempts: 0,
      });

      // TODO: Integrate with Beem API to send SMS
      // await this.beemService.sendSms(requestOtpDto.phone, `Your Shambani OTP is: ${otp}`);
      this.logger.log(`OTP generated for ${requestOtpDto.phone}: ${otp}`);

      // For development, log the OTP
      if (this.configService.get('NODE_ENV') === 'development') {
        console.log(`OTP for ${requestOtpDto.phone}: ${otp}`);
      }

      return {
        success: true,
        message: 'OTP sent successfully',
        data: {
          otpSessionId: `${requestOtpDto.phone}-${Date.now()}`,
          expiresAt,
        },
      };
    } catch (error) {
      this.logger.error(`OTP request failed: ${error.message}`);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to send OTP. Please try again.');
    }
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<AuthResponseDto> {
    try {
      // Check OTP
      const storedOtp = this.otpStore.get(verifyOtpDto.phone);
      
      if (!storedOtp) {
        throw new BadRequestException('OTP not found or expired');
      }

      if (storedOtp.expiresAt < new Date()) {
        this.otpStore.delete(verifyOtpDto.phone);
        throw new BadRequestException('OTP expired');
      }

      if (storedOtp.attempts >= 3) {
        this.otpStore.delete(verifyOtpDto.phone);
        throw new BadRequestException('Too many attempts. Please request a new OTP');
      }

      if (storedOtp.code !== verifyOtpDto.code) {
        storedOtp.attempts++;
        throw new BadRequestException('Invalid OTP');
      }

      // OTP is valid, remove it
      this.otpStore.delete(verifyOtpDto.phone);

      // Find user
      const user = await this.prisma.user.findUnique({
        where: { phone: verifyOtpDto.phone },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          farmName: true,
          businessName: true,
          location: true,
          region: true,
          district: true,
          isActive: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user || !user.isActive) {
        throw new BadRequestException('User not found or inactive');
      }

      // Mark user as verified
      await this.prisma.user.update({
        where: { id: user.id },
        data: { isVerified: true },
      });

      user.isVerified = true;

      // Generate tokens
      const tokens = await this.generateTokens(user);

      this.logger.log(`User verified successfully with OTP: ${user.phone}`);

      return {
        success: true,
        message: 'OTP verified successfully',
        data: {
          user,
          ...tokens,
        },
      };
    } catch (error) {
      this.logger.error(`OTP verification failed: ${error.message}`);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('OTP verification failed. Please try again.');
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResponseDto> {
    try {
      // Validate input
      if (!refreshToken || typeof refreshToken !== 'string' || refreshToken.trim() === '') {
        throw new UnauthorizedException('Refresh token is required');
      }

      // Verify refresh token
      const payload = this.jwtService.verify(refreshToken.trim(), {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      // Validate payload structure
      if (!payload.sub || !payload.email || !payload.role) {
        throw new UnauthorizedException('Invalid token payload');
      }

      // Find user
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          farmName: true,
          businessName: true,
          location: true,
          region: true,
          district: true,
          isActive: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('User not found or inactive');
      }

      // Generate new tokens
      const tokens = await this.generateTokens(user);

      this.logger.log(`Token refreshed successfully for user: ${user.email}`);

      return {
        success: true,
        message: 'Token refreshed successfully',
        data: {
          user,
          ...tokens,
        },
      };
    } catch (error) {
      this.logger.error(`Token refresh failed: ${error.message}`);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async getCurrentUser(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          farmName: true,
          businessName: true,
          location: true,
          region: true,
          district: true,
          isActive: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      return {
        success: true,
        message: 'User retrieved successfully',
        data: user,
      };
    } catch (error) {
      this.logger.error(`Get current user failed: ${error.message}`);
      throw new BadRequestException('Failed to retrieve user');
    }
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      // Find user to ensure they're still active
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          farmName: true,
          businessName: true,
          location: true,
          region: true,
          district: true,
          isActive: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('Invalid token - user not found or inactive');
      }

      return user;
    } catch (error) {
      this.logger.error(`Token validation failed: ${error.message}`);
      throw new UnauthorizedException('Invalid token');
    }
  }

  private async generateTokens(user: any): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: 3600, // 1 hour in seconds
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: 604800, // 7 days in seconds
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 3600, // 1 hour in seconds
    };
  }
}