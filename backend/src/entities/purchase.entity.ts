import { PurchaseItem } from './purchase.item.entity';
import { Supplier } from './supplier.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
@Entity()
export class Purchase {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Supplier, (supplier) => supplier.purchases)
  supplier: Supplier;

  @OneToMany(() => PurchaseItem, (item) => item.purchase)
  items: PurchaseItem[];

  @Column()
  totalAmount: number;

  @CreateDateColumn()
  purchasedAt: Date;
}
