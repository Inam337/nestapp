import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { Product } from '../entities/product.entity';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() body: Partial<Product>): Promise<Product> {
    return this.productService.create(body);
  }

  @Get()
  findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Product> {
    return this.productService.findOne(id);
  }
  @Put(':id')
  update(@Param(':id') id: number, body: Partial<Product>): Promise<Product> {
    return this.productService.update(id, body);
  }

  @Delete(':id')
  remove(@Param(':id') id: number): Promise<void> {
    return this.productService.remove(id);
  }
}
