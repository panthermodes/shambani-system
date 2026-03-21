import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(private prisma: PrismaService) {}

  async createProduct(userId: string, createProductDto: CreateProductDto) {
    try {
      const product = await this.prisma.product.create({
        data: {
          sellerId: userId,
          ...createProductDto,
        },
      });

      this.logger.log(`Product created: ${product.id} by user ${userId}`);
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

  async getProducts(category?: string, isVerified?: boolean) {
    try {
      const where: any = {};
      if (category) where.category = category;
      if (isVerified !== undefined) where.isVerified = isVerified;

      const products = await this.prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
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

  async getMyProducts(userId: string) {
    try {
      const products = await this.prisma.product.findMany({
        where: { sellerId: userId },
        orderBy: { createdAt: 'desc' },
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

  async updateProduct(id: string, userId: string, updateProductDto: UpdateProductDto) {
    try {
      // First check if user owns the product
      const product = await this.prisma.product.findFirst({
        where: { id, sellerId: userId },
      });

      if (!product) {
        throw new NotFoundException('Product not found or access denied');
      }

      const updatedProduct = await this.prisma.product.update({
        where: { id },
        data: updateProductDto,
      });

      this.logger.log(`Product updated: ${id} by user ${userId}`);
      return {
        success: true,
        message: 'Product updated successfully',
        data: updatedProduct,
      };
    } catch (error) {
      this.logger.error(`Failed to update product: ${error.message}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update product');
    }
  }

  async deleteProduct(id: string, userId: string) {
    try {
      // First check if user owns the product
      const product = await this.prisma.product.findFirst({
        where: { id, sellerId: userId },
      });

      if (!product) {
        throw new NotFoundException('Product not found or access denied');
      }

      await this.prisma.product.delete({
        where: { id },
      });

      this.logger.log(`Product deleted: ${id} by user ${userId}`);
      return {
        success: true,
        message: 'Product deleted successfully',
      };
    } catch (error) {
      this.logger.error(`Failed to delete product: ${error.message}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete product');
    }
  }

  async updateProductStock(id: string, stock: number) {
    try {
      const product = await this.prisma.product.update({
        where: { id },
        data: { stock },
      });

      this.logger.log(`Product stock updated: ${id} to ${stock}`);
      return {
        success: true,
        message: 'Product stock updated successfully',
        data: product,
      };
    } catch (error) {
      this.logger.error(`Failed to update product stock: ${error.message}`);
      throw new BadRequestException('Failed to update product stock');
    }
  }

  // Search products
  async searchProducts(query: string, category?: string) {
    try {
      const where: any = {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
        isVerified: true,
      };

      if (category) {
        where.AND = [{ category }];
      }

      const products = await this.prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });

      return {
        success: true,
        message: 'Products searched successfully',
        data: products,
      };
    } catch (error) {
      this.logger.error(`Failed to search products: ${error.message}`);
      throw new BadRequestException('Failed to search products');
    }
  }

  // Get product categories
  async getProductCategories() {
    try {
      const categories = await this.prisma.product.groupBy({
        by: ['category'],
        _count: true,
      });

      const result = categories.map(cat => ({
        category: cat.category,
        count: cat._count,
      }));

      return {
        success: true,
        message: 'Product categories retrieved successfully',
        data: result,
      };
    } catch (error) {
      this.logger.error(`Failed to get product categories: ${error.message}`);
      throw new BadRequestException('Failed to retrieve product categories');
    }
  }

  // Admin methods
  async getAllProducts() {
    try {
      const products = await this.prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
      });

      return {
        success: true,
        message: 'All products retrieved successfully',
        data: products,
      };
    } catch (error) {
      this.logger.error(`Failed to get all products: ${error.message}`);
      throw new BadRequestException('Failed to retrieve products');
    }
  }

  async updateProductStatus(id: string, status: boolean) {
    try {
      // Use isVerified as a temporary workaround for isActive field issues
      const product = await this.prisma.product.update({
        where: { id },
        data: { isVerified: status },
      });

      this.logger.log(`Product status updated: ${id} to ${status}`);
      return {
        success: true,
        message: 'Product status updated successfully',
        data: product,
      };
    } catch (error) {
      this.logger.error(`Failed to update product status: ${error.message}`);
      throw new BadRequestException('Failed to update product status');
    }
  }

  async getProductStats() {
    try {
      const total = await this.prisma.product.count();
      const verified = await this.prisma.product.count({
        where: { isVerified: true },
      });

      const byCategory = await this.prisma.product.groupBy({
        by: ['category'],
        _count: true,
      });

      return {
        success: true,
        message: 'Product statistics retrieved successfully',
        data: {
          total,
          verified,
          unverified: total - verified,
          byCategory,
        },
      };
    } catch (error) {
      this.logger.error(`Failed to get product stats: ${error.message}`);
      throw new BadRequestException('Failed to retrieve product statistics');
    }
  }
}
