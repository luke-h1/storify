import { Field, Int, ObjectType } from 'type-graphql';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { OrderDetails } from './OrderDetails';
import { Payment } from './Payment';
import { User } from './User';

// eslint-disable-next-line no-shadow
export enum OrderStatus {
  Created = 'created',
  Open = 'open',
  Cancelled = 'cancelled',
  AwaitingPayment = 'awaiting:payment',
  Completed = 'completed',
  Refunded = 'refunded',
}

@ObjectType()
@Entity('orders')
export class Order extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  readonly id!: number;

  @Field(() => String)
  @Column({ default: OrderStatus.Created })
  status: string;

  @Field(() => Int)
  @Column()
  total: number;

  @Field(() => Int)
  @Column()
  creatorId: number;

  @Field(() => Int)
  @Column({ nullable: true })
  orderDetailsId: number;

  @Field(() => [OrderDetails])
  @OneToMany(() => OrderDetails, od => od.order, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'OrderDetailsId' })
  orderDetails: OrderDetails[];

  @Field()
  @Column({ nullable: true })
  paymentId: string;

  @OneToMany(() => Payment, p => p.order, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'paymentId' })
  payments: Payment[];

  @ManyToOne(() => User, u => u.orders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creatorId' })
  creator: User;

  @Field(() => String)
  @CreateDateColumn({ type: 'date' })
  readonly createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn({ type: 'date' })
  updatedAt: Date;
}
