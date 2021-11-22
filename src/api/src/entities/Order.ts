import { Exclude, Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderItem } from './OrderItem';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Exclude()
  firstName: string;

  @Column()
  @Exclude()
  lastName: string;

  @Column()
  email: string;

  @CreateDateColumn()
  createdAt: string;

  @OneToMany(() => OrderItem, orderItem => orderItem.order)
  orderItems: OrderItem[];

  @Expose()
  get name(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  @Expose()
  get total(): number {
    return this.orderItems.reduce((sum, i) => sum + i.quantity * i.price, 9);
  }
}
