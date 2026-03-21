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
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  createProduct(@Request() req, @Body() createProductDto: CreateProductDto) {
    return this.productsService.createProduct(req.user.userId, createProductDto);
  }

  @Get()
  getProducts(
    @Query('category') category?: string,
    @Query('isActive') isActive?: boolean,
  ) {
    return this.productsService.getProducts(category, isActive);
  }

  @Get('my')
  getMyProducts(@Request() req) {
    return this.productsService.getMyProducts(req.user.userId);
  }

  @Get('search')
  searchProducts(
    @Query('q') query: string,
    @Query('category') category?: string,
  ) {
    return this.productsService.searchProducts(query, category);
  }

  @Get('categories')
  getProductCategories() {
    return this.productsService.getProductCategories();
  }

  @Get(':id')
  getProduct(@Param('id') id: string) {
    return this.productsService.getProduct(id);
  }

  @Patch(':id')
  updateProduct(@Param('id') id: string, @Request() req, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.updateProduct(id, req.user.userId, updateProductDto);
  }

  @Patch(':id/stock')
  updateProductStock(@Param('id') id: string, @Body('quantity') quantity: number) {
    return this.productsService.updateProductStock(id, quantity);
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string, @Request() req) {
    return this.productsService.deleteProduct(id, req.user.userId);
  }

  // Admin endpoints
  @Get('admin/all')
  @Roles('SUPER_ADMIN')
  getAllProducts() {
    return this.productsService.getAllProducts();
  }

  @Patch('admin/:id/status')
  @Roles('SUPER_ADMIN')
  updateProductStatus(@Param('id') id: string, @Body('isActive') isActive: boolean) {
    return this.productsService.updateProductStatus(id, isActive);
  }

  @Get('admin/stats')
  @Roles('SUPER_ADMIN')
  getProductStats() {
    return this.productsService.getProductStats();
  }
}
