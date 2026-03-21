import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(private prisma: PrismaService) {}

  // ========== EXISTING METHODS (unchanged except getOrderStats) ==========
  async createOrder(userId: string, createOrderDto: CreateOrderDto) {
    try {
      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Calculate total amount from items if not provided
      const totalAmount = createOrderDto.totalAmount || 
        createOrderDto.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      const order = await this.prisma.order.create({
        data: {
          userId,
          orderNumber,
          type: 'PRODUCT',
          status: createOrderDto.status || 'PENDING',
          totalAmount,
          description: createOrderDto.notes,
          metadata: {
            deliveryAddress: createOrderDto.deliveryAddress,
            notes: createOrderDto.notes,
          },
        },
      });

      // Create order items separately
      if (createOrderDto.items && createOrderDto.items.length > 0) {
        await this.prisma.orderItem.createMany({
          data: createOrderDto.items.map(item => ({
            orderId: order.id,
            productId: item.productId,
            name: `Product ${item.productId}`,
            description: `Item for product ${item.productId}`,
            quantity: item.quantity,
            unitPrice: item.price,
            totalPrice: item.price * item.quantity,
          })),
        });
      }

      // Fetch complete order with items manually
      const orderItems = await this.prisma.orderItem.findMany({
        where: { orderId: order.id },
      });

      const completeOrder = {
        ...order,
        items: orderItems,
      };

      this.logger.log(`Order created: ${order.orderNumber} for user ${userId}`);
      return {
        success: true,
        message: 'Order created successfully',
        data: completeOrder,
      };
    } catch (error) {
      this.logger.error(`Failed to create order: ${error.message}`);
      throw new BadRequestException('Failed to create order');
    }
  }
  async getOrders(userId: string, status?: string, type?: string, paymentStatus?: string, startDate?: Date, endDate?: Date, limit?: number, offset?: number) {
    try {
      const where: any = { userId };
      if (status) where.status = status;
      if (type) where.type = type;
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = startDate;
        if (endDate) where.createdAt.lte = endDate;
      }

      const orders = await this.prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit ? parseInt(limit.toString()) : undefined,
        skip: offset ? parseInt(offset.toString()) : undefined,
      });

      // Manually fetch items for each order
      const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
          const items = await this.prisma.orderItem.findMany({
            where: { orderId: order.id },
          });
          return { ...order, items };
        })
      );

      return {
        success: true,
        message: 'Orders retrieved successfully',
        data: ordersWithItems,
      };
    } catch (error) {
      this.logger.error(`Failed to get orders: ${error.message}`);
      throw new BadRequestException('Failed to retrieve orders');
    }
  }
  async getOrder(id: string, userId: string) {
    try {
      const order = await this.prisma.order.findFirst({
        where: { id, userId },
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      // Manually fetch items
      const items = await this.prisma.orderItem.findMany({
        where: { orderId: order.id },
      });

      const orderWithItems = { ...order, items };

      return {
        success: true,
        message: 'Order retrieved successfully',
        data: orderWithItems,
      };
    } catch (error) {
      this.logger.error(`Failed to get order: ${error.message}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to retrieve order');
    }
  }
  async updateOrder(id: string, userId: string, updateOrderDto: UpdateOrderDto) {
    try {
      // Check if order exists and belongs to user
      const existingOrder = await this.prisma.order.findFirst({
        where: { id, userId },
      });

      if (!existingOrder) {
        throw new NotFoundException('Order not found');
      }

      const order = await this.prisma.order.update({
        where: { id },
        data: {
          status: updateOrderDto.status,
          totalAmount: updateOrderDto.totalAmount,
          description: updateOrderDto.notes,
          metadata: {
            deliveryAddress: updateOrderDto.deliveryAddress,
            notes: updateOrderDto.notes,
          },
        },
      });

      // Manually fetch items
      const items = await this.prisma.orderItem.findMany({
        where: { orderId: order.id },
      });

      const orderWithItems = { ...order, items };

      this.logger.log(`Order updated: ${order.orderNumber}`);
      return {
        success: true,
        message: 'Order updated successfully',
        data: orderWithItems,
      };
    } catch (error) {
      this.logger.error(`Failed to update order: ${error.message}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update order');
    }
  }
  async cancelOrder(id: string, userId: string, reason?: string) {
    try {
      // Check if order exists and belongs to user
      const existingOrder = await this.prisma.order.findFirst({
        where: { id, userId },
      });

      if (!existingOrder) {
        throw new NotFoundException('Order not found');
      }

      if (existingOrder.status === 'CANCELLED') {
        throw new BadRequestException('Order is already cancelled');
      }

      if (existingOrder.status === 'DELIVERED') {
        throw new BadRequestException('Cannot cancel delivered order');
      }

      const order = await this.prisma.order.update({
        where: { id },
        data: { 
          status: 'CANCELLED',
          metadata: {
            ...(existingOrder.metadata as any || {}),
            cancellationReason: reason,
            cancelledAt: new Date().toISOString(),
          },
        },
      });

      // Manually fetch items
      const items = await this.prisma.orderItem.findMany({
        where: { orderId: order.id },
      });

      const orderWithItems = { ...order, items };

      this.logger.log(`Order cancelled: ${order.orderNumber}`);
      return {
        success: true,
        message: 'Order cancelled successfully',
        data: orderWithItems,
      };
    } catch (error) {
      this.logger.error(`Failed to cancel order: ${error.message}`);
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to cancel order');
    }
  }
  async getAllOrders(status?: string) {
    try {
      const where: any = {};
      if (status) where.status = status;

      const orders = await this.prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });

      // Manually fetch items for each order
      const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
          const items = await this.prisma.orderItem.findMany({
            where: { orderId: order.id },
          });
          return { ...order, items };
        })
      );

      return {
        success: true,
        message: 'All orders retrieved successfully',
        data: ordersWithItems,
      };
    } catch (error) {
      this.logger.error(`Failed to get all orders: ${error.message}`);
      throw new BadRequestException('Failed to retrieve orders');
    }
  }

  async updateOrderStatus(id: string, status: string) {
    try {
      const order = await this.prisma.order.update({
        where: { id },
        data: { status },
      });

      // Manually fetch items
      const items = await this.prisma.orderItem.findMany({
        where: { orderId: order.id },
      });

      const orderWithItems = { ...order, items };

      this.logger.log(`Order status updated: ${order.orderNumber} to ${status}`);
      return {
        success: true,
        message: 'Order status updated successfully',
        data: orderWithItems,
      };
    } catch (error) {
      this.logger.error(`Failed to update order status: ${error.message}`);
      throw new BadRequestException('Failed to update order status');
    }
  }
  async getProducts(
    category?: string,
    subcategory?: string,
    region?: string,
    district?: string,
    priceMin?: number,
    priceMax?: number,
    inStock?: boolean,
    verified?: boolean,
    featured?: boolean,
    tags?: string,
    search?: string,
    limit?: number,
    offset?: number
  ) {
    try {
      const where: any = {};
      if (category) where.category = category;
      if (subcategory) where.subcategory = subcategory;
      if (priceMin || priceMax) {
        where.price = {};
        if (priceMin) where.price.gte = priceMin;
        if (priceMax) where.price.lte = priceMax;
      }
      if (inStock !== undefined) where.stock = { gte: inStock ? 1 : 0 };
      if (verified !== undefined) where.isVerified = verified;
      if (featured !== undefined) where.isFeatured = featured;
      if (tags) where.tags = { has: tags.split(',') };

      const products = await this.prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit ? parseInt(limit.toString()) : undefined,
        skip: offset ? parseInt(offset.toString()) : undefined,
      });

      return {
        success: true,
        message: 'Products retrieved successfully',
        data: products,
      };
    } catch (error) {
      this.logger.error(`Failed to get products: ${error.message}`);
      throw new BadRequestException('Failed to retrieve products');
    }
  }

  async getProduct(id: string) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      return {
        success: true,
        message: 'Product retrieved successfully',
        data: product,
      };
    } catch (error) {
      this.logger.error(`Failed to get product: ${error.message}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to retrieve product');
    }
  }

  async getMyProducts(userId: string, status?: string, category?: string, limit?: number, offset?: number) {
    try {
      const where: any = { sellerId: userId };
      if (status) where.status = status;
      if (category) where.category = category;

      const products = await this.prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit ? parseInt(limit.toString()) : undefined,
        skip: offset ? parseInt(offset.toString()) : undefined,
      });

      return {
        success: true,
        message: 'My products retrieved successfully',
        data: products,
      };
    } catch (error) {
      this.logger.error(`Failed to get my products: ${error.message}`);
      throw new BadRequestException('Failed to retrieve products');
    }
  }
  async getReviews(productId?: string, userId?: string, rating?: number) {
    try {
      const where: any = {};
      if (productId) where.productId = productId;
      if (userId) where.userId = userId;
      if (rating) where.rating = rating;

      const reviews = await this.prisma.review.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });

      return {
        success: true,
        message: 'Reviews retrieved successfully',
        data: reviews,
      };
    } catch (error) {
      this.logger.error(`Failed to get reviews: ${error.message}`);
      throw new BadRequestException('Failed to retrieve reviews');
    }
  }

  async getReview(id: string) {
    try {
      const review = await this.prisma.review.findUnique({
        where: { id },
      });

      if (!review) {
        throw new NotFoundException('Review not found');
      }

      return {
        success: true,
        message: 'Review retrieved successfully',
        data: review,
      };
    } catch (error) {
      this.logger.error(`Failed to get review: ${error.message}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to retrieve review');
    }
  }
  async getPayments(userId?: string, orderId?: string, status?: string, method?: string, startDate?: string, endDate?: string) {
    try {
      const where: any = {};
      if (userId) where.userId = userId;
      if (orderId) where.orderId = orderId;
      if (status) where.status = status;
      if (method) where.method = method;
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = new Date(startDate);
        if (endDate) where.createdAt.lte = new Date(endDate);
      }

      const payments = await this.prisma.payment.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });

      return {
        success: true,
        message: 'Payments retrieved successfully',
        data: payments,
      };
    } catch (error) {
      this.logger.error(`Failed to get payments: ${error.message}`);
      throw new BadRequestException('Failed to retrieve payments');
    }
  }

  async createProduct(userId: string, productData: any) {
    try {
      const product = await this.prisma.product.create({
        data: {
          sellerId: userId,
          ...productData,
        },
      });

      this.logger.log(`Product created successfully: ${product.id}`);
      return {
        success: true,
        message: 'Product created successfully',
        data: product,
      };
    } catch (error) {
      this.logger.error(`Failed to create product: ${error.message}`);
      throw new BadRequestException('Failed to create product');
    }
  }

  async getOrderStats() {
    try {
      const orders = await this.prisma.order.findMany();

      const statusCount = orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const totalRevenue = orders
        .filter(order => order.status === 'COMPLETED')
        .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
      const pendingRevenue = orders
        .filter(order => ['PENDING', 'CONFIRMED', 'IN_PROGRESS'].includes(order.status))
        .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

      return {
        success: true,
        message: 'Order statistics retrieved successfully',
        data: {
          totalOrders: orders.length,
          statusCount,
          totalRevenue,
          pendingRevenue,
        },
      };
    } catch (error) {
      this.logger.error(`Failed to get order stats: ${error.message}`);
      throw new BadRequestException('Failed to retrieve order statistics');
    }
  }
}