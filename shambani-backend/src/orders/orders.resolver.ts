import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Body } from '@nestjs/common';

@Resolver()
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @Query(() => [Object], { name: 'getOrders' })
  @UseGuards(GqlAuthGuard)
  async getOrders(
    @Args('status', { nullable: true }) status: string,
    @Args('type', { nullable: true }) type: string,
    @Args('paymentStatus', { nullable: true }) paymentStatus: string,
    @Args('startDate', { nullable: true }) startDate: Date,
    @Args('endDate', { nullable: true }) endDate: Date,
    @Args('limit', { nullable: true }) limit: number,
    @Args('offset', { nullable: true }) offset: number,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.ordersService.getOrders(userId, status, type, paymentStatus, startDate, endDate, limit, offset);
  }

  @Query(() => Object, { name: 'getOrder' })
  @UseGuards(GqlAuthGuard)
  async getOrder(@Args('id') id: string, @Context() context) {
    const userId = context.req.user.id;
    return this.ordersService.getOrder(id, userId);
  }

  @Query(() => [Object], { name: 'getProducts' })
  async getProducts(
    @Args('category', { nullable: true }) category: string,
    @Args('subcategory', { nullable: true }) subcategory: string,
    @Args('region', { nullable: true }) region: string,
    @Args('district', { nullable: true }) district: string,
    @Args('priceMin', { nullable: true }) priceMin: number,
    @Args('priceMax', { nullable: true }) priceMax: number,
    @Args('inStock', { nullable: true }) inStock: boolean,
    @Args('verified', { nullable: true }) verified: boolean,
    @Args('featured', { nullable: true }) featured: boolean,
    @Args('tags', { nullable: true }) tags: string,
    @Args('search', { nullable: true }) search: string,
    @Args('limit', { nullable: true }) limit: number,
    @Args('offset', { nullable: true }) offset: number
  ) {
    return this.ordersService.getProducts(category, subcategory, region, district, priceMin, priceMax, inStock, verified, featured, tags, search, limit, offset);
  }

  @Query(() => Object, { name: 'getProduct' })
  async getProduct(@Args('id') id: string) {
    return this.ordersService.getProduct(id);
  }

  @Query(() => [Object], { name: 'getMyProducts' })
  @UseGuards(GqlAuthGuard)
  async getMyProducts(
    @Args('status', { nullable: true }) status: string,
    @Args('category', { nullable: true }) category: string,
    @Args('limit', { nullable: true }) limit: number,
    @Args('offset', { nullable: true }) offset: number,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.ordersService.getMyProducts(userId, status, category, limit, offset);
  }

  @Query(() => [Object], { name: 'getReviews' })
  async getReviews(
    @Args('productId', { nullable: true }) productId: string,
    @Args('userId', { nullable: true }) userId: string,
    @Args('rating', { nullable: true }) rating: number
  ) {
    return this.ordersService.getReviews(productId, userId, rating);
  }

  @Query(() => Object, { name: 'getReview' })
  async getReview(@Args('id') id: string) {
    return this.ordersService.getReview(id);
  }

  @Query(() => [Object], { name: 'getPayments' })
  @UseGuards(GqlAuthGuard)
  async getPayments(
    @Args('orderId', { nullable: true }) orderId: string,
    @Args('status', { nullable: true }) status: string,
    @Args('method', { nullable: true }) method: string,
    @Args('startDate', { nullable: true }) startDate: string,
    @Args('endDate', { nullable: true }) endDate: string,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.ordersService.getPayments(userId, orderId, status, method, startDate, endDate);
  }

  @Query(() => Object, { name: 'getOrderStats' })
  @UseGuards(GqlAuthGuard)
  async getOrderStats(@Context() context) {
    const userId = context.req.user.id;
    return this.ordersService.getOrderStats();
  }

  @Query(() => [Object], { name: 'getAllOrders' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  async getAllOrders(@Args('status', { nullable: true }) status: string) {
    return this.ordersService.getAllOrders(status);
  }

  @Mutation(() => Object, { name: 'createOrder' })
  @UseGuards(GqlAuthGuard)
  async createOrder(@Body() createOrderDto: CreateOrderDto, @Context() context) {
    const userId = context.req.user.id;
    return this.ordersService.createOrder(userId, createOrderDto);
  }

  @Mutation(() => Object, { name: 'updateOrder' })
  @UseGuards(GqlAuthGuard)
  async updateOrder(@Args('id') id: string, @Body() updateOrderDto: UpdateOrderDto, @Context() context) {
    const userId = context.req.user.id;
    return this.ordersService.updateOrder(id, userId, updateOrderDto);
  }

  @Mutation(() => Object, { name: 'cancelOrder' })
  @UseGuards(GqlAuthGuard)
  async cancelOrder(@Args('id') id: string, @Args('reason', { nullable: true }) reason: string, @Context() context) {
    const userId = context.req.user.id;
    return this.ordersService.cancelOrder(id, userId, reason);
  }

  @Mutation(() => Object, { name: 'createProduct' })
  @UseGuards(GqlAuthGuard)
  async createProduct(@Body() productData: any, @Context() context) {
    const userId = context.req.user.id;
    return this.ordersService.createProduct(userId, productData);
  }

  @Mutation(() => Object, { name: 'updateOrderStatus' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  async updateOrderStatus(@Args('id') id: string, @Args('status') status: string) {
    return this.ordersService.updateOrderStatus(id, status);
  }
}
