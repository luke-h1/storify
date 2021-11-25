/* eslint-disable import/no-cycle */
import { Field } from 'type-graphql';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Order } from './Order';

@Entity('order_items')
export class OrderItem extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column()
  productTitle: string;

  @Field(() => Number)
  @Column()
  price: number;

  @Field(() => Number)
  @Column()
  quantity: number;

  @Field(() => Order)
  @ManyToOne(() => Order, order => order.orderItems)
  @JoinColumn({ name: 'order_id' })
  order: Order;
}
