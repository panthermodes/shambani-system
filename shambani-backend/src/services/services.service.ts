import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';

@Injectable()
export class ServicesService {
  private readonly logger = new Logger(ServicesService.name);

  constructor(private prisma: PrismaService) {}

  async createServiceRequest(userId: string, createServiceRequestDto: CreateServiceRequestDto) {
    try {
      // Map DTO fields to database schema
      const data: any = {
        userId,
        serviceType: createServiceRequestDto.serviceType,
        title: createServiceRequestDto.title,
        description: createServiceRequestDto.description || '', // Ensure description is not undefined
        priority: createServiceRequestDto.urgency?.toUpperCase() || 'MEDIUM',
        scheduledAt: createServiceRequestDto.scheduledDate,
        metadata: createServiceRequestDto.farmId ? { farmId: createServiceRequestDto.farmId } : undefined,
      };

      if (createServiceRequestDto.estimatedCost) {
        data.metadata = {
          ...data.metadata,
          estimatedCost: createServiceRequestDto.estimatedCost,
        };
      }

      const serviceRequest = await this.prisma.serviceRequest.create({
        data,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
        },
      });

      this.logger.log(`Service request created: ${serviceRequest.id} by user ${userId}`);
      return {
        success: true,
        message: 'Service request created successfully',
        data: serviceRequest,
      };
    } catch (error) {
      this.logger.error(`Failed to create service request: ${error.message}`);
      throw new BadRequestException('Failed to create service request');
    }
  }

  async getServiceRequests(userId: string, serviceType?: string, status?: string, priority?: string, region?: string, district?: string, startDate?: Date, endDate?: Date) {
    try {
      const where: any = { userId };
      
      if (serviceType) where.serviceType = serviceType;
      if (status) where.status = status;
      if (priority) where.priority = priority;
      
      // Add date range filtering
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = startDate;
        if (endDate) where.createdAt.lte = endDate;
      }

      // Add region/district filtering through user relationship
      if (region || district) {
        where.user = {};
        if (region) where.user.region = region;
        if (district) where.user.district = district;
      }
      
      const requests = await this.prisma.serviceRequest.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              region: true,
              district: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return {
        success: true,
        message: 'Service requests retrieved successfully',
        data: requests,
      };
    } catch (error) {
      this.logger.error(`Failed to get service requests: ${error.message}`);
      throw new BadRequestException('Failed to get service requests');
    }
  }

  async getServiceRequest(id: string, userId: string) {
    try {
      const request = await this.prisma.serviceRequest.findFirst({
        where: { id, userId },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              region: true,
              district: true,
            },
          },
        },
      });

      if (!request) {
        throw new NotFoundException('Service request not found');
      }

      return {
        success: true,
        message: 'Service request retrieved successfully',
        data: request,
      };
    } catch (error) {
      this.logger.error(`Failed to get service request: ${error.message}`);
      throw new BadRequestException('Failed to get service request');
    }
  }

  async updateServiceRequest(id: string, userId: string, updateServiceRequestDto: UpdateServiceRequestDto) {
    try {
      // Check if request exists and belongs to user
      const existingRequest = await this.prisma.serviceRequest.findFirst({
        where: { id, userId },
      });

      if (!existingRequest) {
        throw new NotFoundException('Service request not found or access denied');
      }

      const data: any = { ...updateServiceRequestDto };
      
      // Map DTO fields to database schema
      if (updateServiceRequestDto.urgency) {
        data.priority = updateServiceRequestDto.urgency.toUpperCase();
        delete data.urgency;
      }
      
      if (updateServiceRequestDto.scheduledDate) {
        data.scheduledAt = updateServiceRequestDto.scheduledDate;
        delete data.scheduledDate;
      }

      const request = await this.prisma.serviceRequest.update({
        where: { id },
        data,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
        },
      });

      this.logger.log(`Service request updated: ${id} by user ${userId}`);
      return {
        success: true,
        message: 'Service request updated successfully',
        data: request,
      };
    } catch (error) {
      this.logger.error(`Failed to update service request: ${error.message}`);
      throw new BadRequestException('Failed to update service request');
    }
  }

  async deleteServiceRequest(id: string, userId: string) {
    try {
      // Check if request exists and belongs to user
      const existingRequest = await this.prisma.serviceRequest.findFirst({
        where: { id, userId },
      });

      if (!existingRequest) {
        throw new NotFoundException('Service request not found or access denied');
      }

      await this.prisma.serviceRequest.delete({
        where: { id },
      });

      this.logger.log(`Service request deleted: ${id} by user ${userId}`);
      return {
        success: true,
        message: 'Service request deleted successfully',
      };
    } catch (error) {
      this.logger.error(`Failed to delete service request: ${error.message}`);
      throw new BadRequestException('Failed to delete service request');
    }
  }

  // Get service statistics with full parameter support
  async getServiceStats(userId: string, region?: string, district?: string, startDate?: Date, endDate?: Date) {
    try {
      const where: any = { userId };
      
      // Add date range filtering
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = startDate;
        if (endDate) where.createdAt.lte = endDate;
      }

      // Add region/district filtering through user relationship
      if (region || district) {
        where.user = {};
        if (region) where.user.region = region;
        if (district) where.user.district = district;
      }
      
      const requests = await this.prisma.serviceRequest.findMany({
        where,
      });

      const serviceTypes = requests.reduce((acc, request) => {
        acc[request.serviceType] = (acc[request.serviceType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const statusCount = requests.reduce((acc, request) => {
        acc[request.status] = (acc[request.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        success: true,
        message: 'Service statistics retrieved successfully',
        data: {
          totalRequests: requests.length,
          serviceTypes,
          statusCount,
          recentRequests: requests.slice(0, 10),
        },
      };
    } catch (error) {
      this.logger.error(`Failed to get service stats: ${error.message}`);
      throw new BadRequestException('Failed to get service statistics');
    }
  }

  // Get admin service statistics
  async getAdminServiceStats(region?: string, district?: string) {
    try {
      const where: any = {};
      
      // Add region/district filtering through user relationship
      if (region || district) {
        where.user = {};
        if (region) where.user.region = region;
        if (district) where.user.district = district;
      }
      
      const requests = await this.prisma.serviceRequest.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              region: true,
              district: true,
            },
          },
        },
      });

      const serviceTypes = requests.reduce((acc, request) => {
        acc[request.serviceType] = (acc[request.serviceType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const statusCount = requests.reduce((acc, request) => {
        acc[request.status] = (acc[request.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const priorityCount = requests.reduce((acc, request) => {
        acc[request.priority] = (acc[request.priority] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        success: true,
        message: 'Admin service statistics retrieved successfully',
        data: {
          totalRequests: requests.length,
          serviceTypes,
          statusCount,
          priorityCount,
          recentRequests: requests.slice(0, 50),
          requestsByRegion: requests.reduce((acc, request) => {
            const region = request.user.region || 'Unknown';
            acc[region] = (acc[region] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
        },
      };
    } catch (error) {
      this.logger.error(`Failed to get admin service stats: ${error.message}`);
      throw new BadRequestException('Failed to get admin service statistics');
    }
  }

  // Rate service request
  async rateServiceRequest(userId: string, serviceRequestId: string, input: any) {
    try {
      const { rating, feedback } = input;
      
      // Check if request exists and belongs to user
      const existingRequest = await this.prisma.serviceRequest.findFirst({
        where: { id: serviceRequestId, userId },
      });

      if (!existingRequest) {
        throw new NotFoundException('Service request not found or access denied');
      }

      const request = await this.prisma.serviceRequest.update({
        where: { id: serviceRequestId, userId },
        data: {
          rating,
          feedback,
          status: 'COMPLETED',
          completedAt: new Date(),
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
        },
      });

      this.logger.log(`Service rated: ${serviceRequestId} by user ${userId} with rating ${rating}`);
      return {
        success: true,
        message: 'Service rated successfully',
        data: request,
      };
    } catch (error) {
      this.logger.error(`Failed to rate service: ${error.message}`);
      throw new BadRequestException('Failed to rate service');
    }
  }

  // Extension Officer methods
  async getAssignedServices(assignedTo: string, status?: string) {
    try {
      const where: any = { assignedTo };
      if (status) where.status = status;

      const requests = await this.prisma.serviceRequest.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
        },
        orderBy: { scheduledAt: 'asc' },
      });

      return {
        success: true,
        message: 'Assigned services retrieved successfully',
        data: requests,
      };
    } catch (error) {
      this.logger.error(`Failed to get assigned services: ${error.message}`);
      throw new BadRequestException('Failed to retrieve assigned services');
    }
  }

  async updateServiceStatus(serviceRequestId: string, userId: string, status: string, notes?: string) {
    try {
      const updateData: any = { status };
      if (notes) updateData.notes = notes;
      if (status === 'COMPLETED') updateData.completedAt = new Date();

      const request = await this.prisma.serviceRequest.update({
        where: { id: serviceRequestId },
        data: updateData,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
        },
      });

      this.logger.log(`Service status updated: ${serviceRequestId} to ${status}`);
      return {
        success: true,
        message: 'Service status updated successfully',
        data: request,
      };
    } catch (error) {
      this.logger.error(`Failed to update service status: ${error.message}`);
      throw new BadRequestException('Failed to update service status');
    }
  }

  // Admin methods
  async getAllServiceStats(region?: string, district?: string) {
    try {
      const where: any = {};
      
      // Add region/district filtering through user relationship
      if (region || district) {
        where.user = {};
        if (region) where.user.region = region;
        if (district) where.user.district = district;
      }
      
      const requests = await this.prisma.serviceRequest.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true,
              region: true,
              district: true,
            },
          },
        },
      });

      const serviceTypes = requests.reduce((acc, request) => {
        acc[request.serviceType] = (acc[request.serviceType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const statusCount = requests.reduce((acc, request) => {
        acc[request.status] = (acc[request.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        success: true,
        message: 'All service statistics retrieved successfully',
        data: {
          totalRequests: requests.length,
          serviceTypes,
          statusCount,
          recentRequests: requests.slice(0, 50),
        },
      };
    } catch (error) {
      this.logger.error(`Failed to get all service stats: ${error.message}`);
      throw new BadRequestException('Failed to retrieve service statistics');
    }
  }

  async getAllServiceRequests() {
    try {
      const requests = await this.prisma.serviceRequest.findMany({
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              role: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return {
        success: true,
        message: 'All service requests retrieved successfully',
        data: requests,
      };
    } catch (error) {
      this.logger.error(`Failed to get all service requests: ${error.message}`);
      throw new BadRequestException('Failed to retrieve service requests');
    }
  }

  async assignServiceRequest(serviceRequestId: string, extensionOfficerId: string, input?: { notes?: string }) {
    try {
      const request = await this.prisma.serviceRequest.update({
        where: { id: serviceRequestId },
        data: {
          assignedTo: extensionOfficerId,
          status: 'ASSIGNED',
          notes: input?.notes,
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
        },
      });

      this.logger.log(`Service request assigned: ${serviceRequestId} to ${extensionOfficerId}`);
      return {
        success: true,
        message: 'Service request assigned successfully',
        data: request,
      };
    } catch (error) {
      this.logger.error(`Failed to assign service request: ${error.message}`);
      throw new BadRequestException('Failed to assign service request');
    }
  }

  // Additional methods needed by resolver
  async getServiceAssignments(serviceRequestId?: string, currentUser?: any) {
    try {
      const where: any = {};
      if (serviceRequestId) {
        where.id = serviceRequestId;
      }
      if (currentUser?.role === 'EXTENSION_OFFICER') {
        where.assignedTo = currentUser.id;
      }

      const assignments = await this.prisma.serviceRequest.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return {
        success: true,
        message: 'Service assignments retrieved successfully',
        data: assignments,
      };
    } catch (error) {
      this.logger.error(`Failed to get service assignments: ${error.message}`);
      throw new BadRequestException('Failed to retrieve service assignments');
    }
  }

  async getServiceRatings(extensionOfficerId?: string, currentUser?: any) {
    try {
      const officerId = extensionOfficerId || currentUser?.id;
      
      const where: any = {
        rating: { not: null },
        status: 'COMPLETED'
      };
      
      if (officerId) {
        where.assignedTo = officerId;
      }

      const ratings = await this.prisma.serviceRequest.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
        },
        orderBy: { completedAt: 'desc' },
      });

      return {
        success: true,
        message: 'Service ratings retrieved successfully',
        data: ratings,
      };
    } catch (error) {
      this.logger.error(`Failed to get service ratings: ${error.message}`);
      throw new BadRequestException('Failed to get service ratings');
    }
  }

  async getExtensionOfficerStats(extensionOfficerId: string, currentUser?: any) {
    try {
      const officerId = extensionOfficerId || currentUser?.id;
      
      const [assignedCount, completedCount, avgRating] = await Promise.all([
        this.prisma.serviceRequest.count({
          where: {
            assignedTo: officerId,
            status: { in: ['ASSIGNED', 'IN_PROGRESS'] }
          }
        }),
        this.prisma.serviceRequest.count({
          where: {
            assignedTo: officerId,
            status: 'COMPLETED'
          }
        }),
        this.prisma.serviceRequest.aggregate({
          where: {
            assignedTo: officerId,
            status: 'COMPLETED',
            rating: { not: null }
          },
          _avg: {
            rating: true
          }
        })
      ]);

      return {
        success: true,
        message: 'Extension officer stats retrieved successfully',
        data: {
          officerId,
          assignedRequests: assignedCount,
          completedRequests: completedCount,
          averageRating: avgRating._avg.rating || 0,
          completionRate: completedCount > 0 ? (completedCount / (assignedCount + completedCount)) * 100 : 0
        }
      };
    } catch (error) {
      this.logger.error(`Failed to get extension officer stats: ${error.message}`);
      throw new BadRequestException('Failed to retrieve extension officer stats');
    }
  }

  async getAvailableExtensionOfficers(region?: string, district?: string) {
    try {
      const where: any = {
        role: 'EXTENSION_OFFICER',
        isActive: true,
      };
      
      if (region) where.region = region;
      if (district) where.district = district;

      const officers = await this.prisma.user.findMany({
        where,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          region: true,
          district: true,
        },
      });

      return {
        success: true,
        message: 'Available extension officers retrieved successfully',
        data: officers,
      };
    } catch (error) {
      this.logger.error(`Failed to get available extension officers: ${error.message}`);
      throw new BadRequestException('Failed to get available extension officers');
    }
  }

  async getServiceHistory(targetUserId: string, serviceType?: string, currentUser?: any) {
    try {
      // Check if user has permission to view history
      if (targetUserId !== currentUser?.id && currentUser?.role !== 'SUPER_ADMIN' && currentUser?.role !== 'EXTENSION_OFFICER') {
        throw new BadRequestException('Access denied');
      }

      const where: any = { userId: targetUserId };
      if (serviceType) where.serviceType = serviceType;

      const history = await this.prisma.serviceRequest.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return {
        success: true,
        message: 'Service history retrieved successfully',
        data: history,
      };
    } catch (error) {
      this.logger.error(`Failed to get service history: ${error.message}`);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to get service history');
    }
  }

  async getPendingServiceRequests() {
    try {
      const requests = await this.prisma.serviceRequest.findMany({
        where: { status: 'PENDING' },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return {
        success: true,
        data: requests,
      };
    } catch (error) {
      this.logger.error(`Failed to get pending service requests: ${error.message}`);
      throw new BadRequestException('Failed to get pending service requests');
    }
  }

  async getServicePerformanceMetrics(startDate?: Date, endDate?: Date) {
    try {
      const where: any = {};
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = startDate;
        if (endDate) where.createdAt.lte = endDate;
      }

      const total = await this.prisma.serviceRequest.count({ where });
      const completed = await this.prisma.serviceRequest.count({
        where: { ...where, status: 'COMPLETED' },
      });
      const pending = await this.prisma.serviceRequest.count({
        where: { ...where, status: 'PENDING' },
      });
      const inProgress = await this.prisma.serviceRequest.count({
        where: { ...where, status: 'IN_PROGRESS' },
      });

      return {
        success: true,
        data: {
          total,
          completed,
          pending,
          inProgress,
          completionRate: total > 0 ? (completed / total) * 100 : 0,
        },
      };
    } catch (error) {
      this.logger.error(`Failed to get service performance metrics: ${error.message}`);
      throw new BadRequestException('Failed to get service performance metrics');
    }
  }

  async acceptServiceAssignment(serviceRequestId: string, userId: string) {
    try {
      const request = await this.prisma.serviceRequest.update({
        where: { id: serviceRequestId },
        data: {
          assignedTo: userId,
          status: 'IN_PROGRESS',
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
        },
      });

      this.logger.log(`Service assignment accepted: ${serviceRequestId} by user ${userId}`);
      return {
        success: true,
        message: 'Service assignment accepted successfully',
        data: request,
      };
    } catch (error) {
      this.logger.error(`Failed to accept service assignment: ${error.message}`);
      throw new BadRequestException('Failed to accept service assignment');
    }
  }

  async rejectServiceAssignment(serviceRequestId: string, userId: string, reason?: string) {
    try {
      const request = await this.prisma.serviceRequest.update({
        where: { id: serviceRequestId },
        data: {
          status: 'PENDING',
          assignedTo: null,
          notes: reason,
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
        },
      });

      this.logger.log(`Service assignment rejected: ${serviceRequestId} by user ${userId}`);
      return {
        success: true,
        message: 'Service assignment rejected successfully',
        data: request,
      };
    } catch (error) {
      this.logger.error(`Failed to reject service assignment: ${error.message}`);
      throw new BadRequestException('Failed to reject service assignment');
    }
  }

  async completeServiceRequest(serviceRequestId: string, userId: string, input: any) {
    try {
      const request = await this.prisma.serviceRequest.findFirst({
        where: { id: serviceRequestId }
      });

      if (!request) {
        throw new NotFoundException('Service request not found');
      }

      const updatedRequest = await this.prisma.serviceRequest.update({
        where: { id: serviceRequestId },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          notes: input?.notes,
          rating: input?.rating,
          feedback: input?.feedback,
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
        },
      });

      this.logger.log(`Service request completed: ${serviceRequestId} by user ${userId}`);
      return {
        success: true,
        message: 'Service request completed successfully',
        data: updatedRequest,
      };
    } catch (error) {
      this.logger.error(`Failed to complete service request: ${error.message}`);
      throw new BadRequestException('Failed to complete service request');
    }
  }

  async rateService(serviceRequestId: string, userId: string, input: { rating: number; feedback?: string }) {
    try {
      const { rating, feedback } = input;
      
      // Check if request exists and belongs to user
      const existingRequest = await this.prisma.serviceRequest.findFirst({
        where: { id: serviceRequestId, userId },
      });

      if (!existingRequest) {
        throw new NotFoundException('Service request not found or access denied');
      }

      const request = await this.prisma.serviceRequest.update({
        where: { id: serviceRequestId, userId },
        data: {
          rating,
          feedback,
          status: 'COMPLETED',
          completedAt: new Date(),
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
        },
      });

      this.logger.log(`Service rated: ${serviceRequestId} by user ${userId} with rating ${rating}`);
      return {
        success: true,
        message: 'Service rated successfully',
        data: request,
      };
    } catch (error) {
      this.logger.error(`Failed to rate service: ${error.message}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to rate service');
    }
  }

  async cancelServiceRequest(serviceRequestId: string, userId: string, reason?: string) {
    try {
      const request = await this.prisma.serviceRequest.update({
        where: { id: serviceRequestId },
        data: {
          status: 'CANCELLED',
          notes: reason,
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
        },
      });

      this.logger.log(`Service request cancelled: ${serviceRequestId} by user ${userId}`);
      return {
        success: true,
        message: 'Service request cancelled successfully',
        data: request,
      };
    } catch (error) {
      this.logger.error(`Failed to cancel service request: ${error.message}`);
      throw new BadRequestException('Failed to cancel service request');
    }
  }

  async rescheduleServiceRequest(serviceRequestId: string, userId: string, newDate: Date, reason?: string) {
    try {
      const request = await this.prisma.serviceRequest.update({
        where: { id: serviceRequestId },
        data: {
          scheduledAt: newDate,
          notes: reason,
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
        },
      });

      this.logger.log(`Service request rescheduled: ${serviceRequestId} by user ${userId}`);
      return {
        success: true,
        message: 'Service request rescheduled successfully',
        data: request,
      };
    } catch (error) {
      this.logger.error(`Failed to reschedule service request: ${error.message}`);
      throw new BadRequestException('Failed to reschedule service request');
    }
  }
}
