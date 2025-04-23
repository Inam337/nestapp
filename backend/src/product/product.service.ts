import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async create(data: Partial<Product>): Promise<Product> {
    const product = this.productRepo.create(data);
    return this.productRepo.save(product);
  }
  findAll(): Promise<Product[]> {
    return this.productRepo.find({ relations: ['category', 'stock'] });
  }
  async findOne(id: number): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['category', 'stock'],
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: number, data: Partial<Product>): Promise<Product> {
    await this.findOne(id);
    await this.productRepo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepo.remove(product);
  }
}
