import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { SaleItem } from './sale.item.entity';

@Entity()
export class Sale {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => SaleItem, (item) => item.sale)
  items: SaleItem[];

  @Column()
  totalAmount: number;

  @CreateDateColumn()
  soldAt: Date;
}
