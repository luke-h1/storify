/* eslint-disable import/no-cycle */
import { Field, Int, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cart } from './Cart';
import { Order } from './Order';
import { OrderDetails } from './OrderDetails';
import { Payment } from './Payment';
import { Product } from './Product';
import { Review } from './Review';

@ObjectType()
@Entity('users')
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName!: string;

  @Field()
  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @OneToMany(() => Product, p => p.creator, { onDelete: 'CASCADE' })
  products: Product[];

  @OneToMany(() => Order, o => o.creator, { onDelete: 'CASCADE' })
  orders: Order[];

  @OneToMany(() => Payment, p => p.creator, { onDelete: 'CASCADE' })
  payments: Payment[];

  @OneToMany(() => Review, r => r.creator, { onDelete: 'CASCADE' })
  reviews: Review[];

  @OneToMany(() => Cart, c => c.creator, { onDelete: 'CASCADE' })
  cart: Cart;

  @OneToMany(() => OrderDetails, od => od.creator, { onDelete: 'CASCADE' })
  orderDetails: OrderDetails;

  @Field(() => Boolean)
  @Column({ default: false })
  isAdmin: Boolean;

  @Field(() => String)
  @CreateDateColumn({ type: 'date' })
  readonly createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn({ type: 'date' })
  updatedAt: Date;
}
