import { Field, Int, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './Order';

@ObjectType()
@Entity('order_items')
export class OrderItem extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @Column()
  productTitle: string;

  @Field(() => Int)
  @Column()
  price: number;

  @Field(() => Int)
  @Column()
  qty: number;

  @Field(() => Order)
  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Field(() => String)
  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
