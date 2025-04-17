import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class Stock {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.stock, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  product: Product;

  @Column('int')
  quantity: number;

  @Column()
  location: string;

  @CreateDateColumn()
  lastUpdated: Date;
}
