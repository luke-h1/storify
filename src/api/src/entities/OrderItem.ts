import { Field, Int, ObjectType } from 'type-graphql';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './Order';
import { Product } from './Product';

@ObjectType()
@Entity('order_items')
export class OrderItem extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column('smallint')
  quantity: number;

  @Field(() => String)
  @Column('varchar', { length: 60 })
  productTitle: string;

  @Field(() => Order)
  @ManyToOne(() => Order, order => order.orderItem, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'orderId' })
  orderId: Order;

  @Field(() => Product)
  @ManyToOne(() => Product, product => product.cartItem, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  productId: Product;
}
