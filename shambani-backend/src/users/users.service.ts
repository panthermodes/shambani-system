import { Injectable, ConflictException, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdatePasswordDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserResponseDto, UsersListResponseDto } from './dto/user.response';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    try {
      // Check if user already exists
      const existingUser = await this.prisma.user.findFirst({
        where: {
          OR: [
            { email: createUserDto.email },
            { phone: createUserDto.phone },
          ],
        },
      });

      if (existingUser) {
        if (existingUser.email === createUserDto.email) {
          throw new ConflictException('User with this email already exists');
        }
        if (existingUser.phone === createUserDto.phone) {
          throw new ConflictException('User with this phone number already exists');
        }
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

      // Create user
      const user = await this.prisma.user.create({
        data: {
          email: createUserDto.email,
          password: hashedPassword,
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
          phone: createUserDto.phone,
          role: createUserDto.role,
          farmName: createUserDto.farmName,
          businessName: createUserDto.businessName,
          location: createUserDto.location,
          region: createUserDto.region,
          district: createUserDto.district,
          isActive: createUserDto.isActive ?? true,
          isVerified: createUserDto.isVerified ?? false,
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

      this.logger.log(`User created successfully: ${user.email}`);

      return {
        success: true,
        message: 'User created successfully',
        data: user,
      };
    } catch (error) {
      this.logger.error(`User creation failed: ${error.message}`);
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('User creation failed. Please try again.');
    }
  }

  async findAll(params?: {
    page?: number;
    limit?: number;
    role?: string;
    search?: string;
    isActive?: boolean;
  }): Promise<UsersListResponseDto> {
    try {
      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const skip = (page - 1) * limit;

      const where: any = {};

      if (params?.role) {
        where.role = params.role;
      }

      if (params?.isActive !== undefined) {
        where.isActive = params.isActive;
      }

      if (params?.search) {
        where.OR = [
          { firstName: { contains: params.search, mode: 'insensitive' } },
          { lastName: { contains: params.search, mode: 'insensitive' } },
          { email: { contains: params.search, mode: 'insensitive' } },
          { phone: { contains: params.search, mode: 'insensitive' } },
          { farmName: { contains: params.search, mode: 'insensitive' } },
          { businessName: { contains: params.search, mode: 'insensitive' } },
        ];
      }

      const [users, total] = await Promise.all([
        this.prisma.user.findMany({
          where,
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
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.user.count({ where }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        message: 'Users retrieved successfully',
        data: users,
        meta: {
          total,
          page,
          limit,
          totalPages,
        },
      };
    } catch (error) {
      this.logger.error(`Failed to retrieve users: ${error.message}`);
      throw new BadRequestException('Failed to retrieve users');
    }
  }

  async findOne(id: string): Promise<UserResponseDto> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
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
        throw new NotFoundException('User not found');
      }

      return {
        success: true,
        message: 'User retrieved successfully',
        data: user,
      };
    } catch (error) {
      this.logger.error(`Failed to retrieve user: ${error.message}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to retrieve user');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    try {
      // Check if user exists
      const existingUser = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        throw new NotFoundException('User not found');
      }

      // Check if email or phone is already taken by another user
      if (updateUserDto.email || updateUserDto.phone) {
        const duplicateUser = await this.prisma.user.findFirst({
          where: {
            AND: [
              { id: { not: id } },
              {
                OR: [
                  updateUserDto.email ? { email: updateUserDto.email } : {},
                  updateUserDto.phone ? { phone: updateUserDto.phone } : {},
                ].filter(condition => Object.keys(condition).length > 0),
              },
            ],
          },
        });

        if (duplicateUser) {
          if (duplicateUser.email === updateUserDto.email) {
            throw new ConflictException('Email is already taken by another user');
          }
          if (duplicateUser.phone === updateUserDto.phone) {
            throw new ConflictException('Phone number is already taken by another user');
          }
        }
      }

      // Update user
      const user = await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
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

      this.logger.log(`User updated successfully: ${user.email}`);

      return {
        success: true,
        message: 'User updated successfully',
        data: user,
      };
    } catch (error) {
      this.logger.error(`User update failed: ${error.message}`);
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('User update failed. Please try again.');
    }
  }

  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto): Promise<UserResponseDto> {
    try {
      // Check if user exists
      const user = await this.prisma.user.findUnique({
        where: { id },
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
          password: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(updatePasswordDto.currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        throw new BadRequestException('Current password is incorrect');
      }

      // Hash new password
      const saltRounds = 12;
      const hashedNewPassword = await bcrypt.hash(updatePasswordDto.newPassword, saltRounds);

      // Update password
      await this.prisma.user.update({
        where: { id },
        data: { password: hashedNewPassword },
      });

      // Remove password from response
      const { password, ...userWithoutPassword } = user;

      this.logger.log(`Password updated successfully for user: ${user.email}`);

      return {
        success: true,
        message: 'Password updated successfully',
        data: userWithoutPassword,
      };
    } catch (error) {
      this.logger.error(`Password update failed: ${error.message}`);
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Password update failed. Please try again.');
    }
  }

  async remove(id: string): Promise<UserResponseDto> {
    try {
      // Check if user exists
      const existingUser = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        throw new NotFoundException('User not found');
      }

      // Soft delete by deactivating user
      const user = await this.prisma.user.update({
        where: { id },
        data: { isActive: false },
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

      this.logger.log(`User deactivated successfully: ${user.email}`);

      return {
        success: true,
        message: 'User deactivated successfully',
        data: user,
      };
    } catch (error) {
      this.logger.error(`User deactivation failed: ${error.message}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('User deactivation failed. Please try again.');
    }
  }

  async activate(id: string): Promise<UserResponseDto> {
    try {
      // Check if user exists
      const existingUser = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        throw new NotFoundException('User not found');
      }

      // Activate user
      const user = await this.prisma.user.update({
        where: { id },
        data: { isActive: true },
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

      this.logger.log(`User activated successfully: ${user.email}`);

      return {
        success: true,
        message: 'User activated successfully',
        data: user,
      };
    } catch (error) {
      this.logger.error(`User activation failed: ${error.message}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('User activation failed. Please try again.');
    }
  }

  async getUserStats(): Promise<any> {
    try {
      const [
        totalUsers,
        activeUsers,
        verifiedUsers,
        usersByRole,
      ] = await Promise.all([
        this.prisma.user.count(),
        this.prisma.user.count({ where: { isActive: true } }),
        this.prisma.user.count({ where: { isVerified: true } }),
        this.prisma.user.groupBy({
          by: ['role'],
          _count: { role: true },
        }),
      ]);

      const roleStats = usersByRole.reduce((acc, item) => {
        acc[item.role] = item._count.role;
        return acc;
      }, {} as Record<string, number>);

      return {
        success: true,
        message: 'User statistics retrieved successfully',
        data: {
          totalUsers,
          activeUsers,
          verifiedUsers,
          inactiveUsers: totalUsers - activeUsers,
          unverifiedUsers: totalUsers - verifiedUsers,
          usersByRole: roleStats,
        },
      };
    } catch (error) {
      this.logger.error(`Failed to retrieve user stats: ${error.message}`);
      throw new BadRequestException('Failed to retrieve user statistics');
    }
  }

  async getProfile(userId: string): Promise<any> {
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
        throw new NotFoundException('User not found');
      }

      return {
        success: true,
        message: 'User profile retrieved successfully',
        data: user,
      };
    } catch (error) {
      this.logger.error(`Failed to retrieve user profile: ${error.message}`);
      throw new BadRequestException('Failed to retrieve user profile');
    }
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<any> {
    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: updateProfileDto,
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

      this.logger.log(`User profile updated successfully: ${userId}`);
      return {
        success: true,
        message: 'User profile updated successfully',
        data: user,
      };
    } catch (error) {
      this.logger.error(`Failed to update user profile: ${error.message}`);
      throw new BadRequestException('Failed to update user profile');
    }
  }

  async getUsersByRole(role: string): Promise<any> {
    try {
      const users = await this.prisma.user.findMany({
        where: { role },
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
        orderBy: { createdAt: 'desc' },
      });

      return {
        success: true,
        message: `Users with role ${role} retrieved successfully`,
        data: users,
      };
    } catch (error) {
      this.logger.error(`Failed to retrieve users by role: ${error.message}`);
      throw new BadRequestException('Failed to retrieve users by role');
    }
  }

  async verifyUser(id: string): Promise<UserResponseDto> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: { isVerified: true },
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

      this.logger.log(`User verified successfully: ${id}`);
      return {
        success: true,
        message: 'User verified successfully',
        data: user,
      };
    } catch (error) {
      this.logger.error(`Failed to verify user: ${error.message}`);
      throw new BadRequestException('Failed to verify user');
    }
  }

  async updateUserRole(id: string, role: string): Promise<UserResponseDto> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: { role },
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

      this.logger.log(`User role updated successfully: ${id}`);
      return {
        success: true,
        message: 'User role updated successfully',
        data: user,
      };
    } catch (error) {
      this.logger.error(`Failed to update user role: ${error.message}`);
      throw new BadRequestException('Failed to update user role');
    }
  }

  async transferUser(id: string, data: { location?: string; region?: string; district?: string }): Promise<UserResponseDto> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: {
          location: data.location,
          region: data.region,
          district: data.district,
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

      this.logger.log(`User transferred successfully: ${id}`);
      return {
        success: true,
        message: 'User transferred successfully',
        data: user,
      };
    } catch (error) {
      this.logger.error(`Failed to transfer user: ${error.message}`);
      throw new BadRequestException('Failed to transfer user');
    }
  }

  async deactivateUser(id: string): Promise<UserResponseDto> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: { isActive: false },
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

      this.logger.log(`User deactivated successfully: ${id}`);
      return {
        success: true,
        message: 'User deactivated successfully',
        data: user,
      };
    } catch (error) {
      this.logger.error(`Failed to deactivate user: ${error.message}`);
      throw new BadRequestException('Failed to deactivate user');
    }
  }

  async activateUser(id: string): Promise<UserResponseDto> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: { isActive: true },
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

      this.logger.log(`User activated successfully: ${id}`);
      return {
        success: true,
        message: 'User activated successfully',
        data: user,
      };
    } catch (error) {
      this.logger.error(`Failed to activate user: ${error.message}`);
      throw new BadRequestException('Failed to activate user');
    }
  }

  async getAllUsers(): Promise<UsersListResponseDto> {
    try {
      const users = await this.prisma.user.findMany({
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
        orderBy: { createdAt: 'desc' },
      });

      return {
        success: true,
        message: 'All users retrieved successfully',
        data: users,
        meta: {
          total: users.length,
          page: 1,
          limit: users.length,
          totalPages: 1,
        },
      };
    } catch (error) {
      this.logger.error(`Failed to retrieve all users: ${error.message}`);
      throw new BadRequestException('Failed to retrieve all users');
    }
  }

  async getUser(id: string, currentUser?: any): Promise<UserResponseDto> {
    return this.findOne(id);
  }

  async searchUsers(query: string, currentUser?: any): Promise<UsersListResponseDto> {
    try {
      const users = await this.prisma.user.findMany({
        where: {
          OR: [
            { firstName: { contains: query, mode: 'insensitive' } },
            { lastName: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
            { phone: { contains: query, mode: 'insensitive' } },
            { farmName: { contains: query, mode: 'insensitive' } },
            { businessName: { contains: query, mode: 'insensitive' } },
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
          isActive: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      return {
        success: true,
        message: 'Users search completed successfully',
        data: users,
        meta: {
          total: users.length,
          page: 1,
          limit: users.length,
          totalPages: 1,
        },
      };
    } catch (error) {
      this.logger.error(`Failed to search users: ${error.message}`);
      throw new BadRequestException('Failed to search users');
    }
  }

  async getFarmersStats(currentUser?: any): Promise<any> {
    try {
      const totalFarmers = await this.prisma.user.count({
        where: { role: 'FARMER' },
      });

      const activeFarmers = await this.prisma.user.count({
        where: { role: 'FARMER', isActive: true },
      });

      return {
        success: true,
        message: 'Farmer statistics retrieved successfully',
        data: {
          totalFarmers,
          activeFarmers,
          inactiveFarmers: totalFarmers - activeFarmers,
        },
      };
    } catch (error) {
      this.logger.error(`Failed to retrieve farmer statistics: ${error.message}`);
      throw new BadRequestException('Failed to retrieve farmer statistics');
    }
  }

  async getExtensionOfficersStats(): Promise<any> {
    try {
      const totalOfficers = await this.prisma.user.count({
        where: { role: 'EXTENSION_OFFICER' },
      });

      const activeOfficers = await this.prisma.user.count({
        where: { role: 'EXTENSION_OFFICER', isActive: true },
      });

      return {
        success: true,
        message: 'Extension officer statistics retrieved successfully',
        data: {
          totalOfficers,
          activeOfficers,
          inactiveOfficers: totalOfficers - activeOfficers,
        },
      };
    } catch (error) {
      this.logger.error(`Failed to retrieve extension officer statistics: ${error.message}`);
      throw new BadRequestException('Failed to retrieve extension officer statistics');
    }
  }
}