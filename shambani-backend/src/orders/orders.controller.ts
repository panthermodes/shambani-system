import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  createOrder(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(req.user.userId, createOrderDto);
  }

  @Get()
  getOrders(@Request() req, @Query('status') status?: string) {
    return this.ordersService.getOrders(req.user.userId, status);
  }

  @Get(':id')
  getOrder(@Param('id') id: string, @Request() req) {
    return this.ordersService.getOrder(id, req.user.userId);
  }

  @Patch(':id')
  updateOrder(@Param('id') id: string, @Request() req, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.updateOrder(id, req.user.userId, updateOrderDto);
  }

  @Patch(':id/cancel')
  cancelOrder(@Param('id') id: string, @Request() req, @Body('reason') reason?: string) {
    return this.ordersService.cancelOrder(id, req.user.userId, reason);
  }

  // Admin endpoints
  @Get('admin/all')
  @Roles('SUPER_ADMIN')
  getAllOrders(@Query('status') status?: string) {
    return this.ordersService.getAllOrders(status);
  }

  @Patch('admin/:id/status')
  @Roles('SUPER_ADMIN')
  updateOrderStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.ordersService.updateOrderStatus(id, status);
  }

  @Get('admin/stats')
  @Roles('SUPER_ADMIN')
  getOrderStats() {
    return this.ordersService.getOrderStats();
  }

  // Product endpoints (moved after order-specific routes to avoid conflicts)
  @Get('products/list')
  getProducts(
    @Query('category') category?: string,
    @Query('subcategory') subcategory?: string,
    @Query('region') region?: string,
    @Query('district') district?: string,
    @Query('priceMin') priceMin?: number,
    @Query('priceMax') priceMax?: number,
    @Query('inStock') inStock?: boolean,
    @Query('verified') verified?: boolean,
    @Query('featured') featured?: boolean,
    @Query('tags') tags?: string,
    @Query('search') search?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number
  ) {
    return this.ordersService.getProducts(category, subcategory, region, district, priceMin, priceMax, inStock, verified, featured, tags, search, limit, offset);
  }

  @Post('products')
  createProduct(@Request() req, @Body() productData: any) {
    return this.ordersService.createProduct(req.user.userId, productData);
  }

  // Review endpoints
  @Get('reviews/list')
  getReviews(
    @Query('productId') productId?: string,
    @Query('userId') userId?: string,
    @Query('rating') rating?: number
  ) {
    return this.ordersService.getReviews(productId, userId, rating);
  }

  // Payment endpoints
  @Get('payments/list')
  getPayments(
    @Request() req,
    @Query('orderId') orderId?: string,
    @Query('status') status?: string,
    @Query('method') method?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    return this.ordersService.getPayments(req.user.userId, orderId, status, method, startDate, endDate);
  }
}
