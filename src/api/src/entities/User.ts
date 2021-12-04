/* eslint-disable import/no-cycle */
import { Field, Int, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cart } from './Cart';
import { Order } from './Order';
import { Product } from './Product';
import { Review } from './Review';

@ObjectType()
@Entity('users')
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

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

  @OneToMany(() => Product, p => p.creator)
  products: Product[];

  @OneToMany(() => Review, r => r.creator)
  reviews: Review[];

  @Field(() => [Order])
  @OneToMany(() => Order, order => order.userId)
  orderId: Order[];

  @Field(() => Cart)
  @OneToOne(() => Cart, cart => cart.userId)
  cartId = Cart;

  @Field(() => String)
  @Column({ default: false })
  isAdmin: Boolean;

  @Field(() => String)
  @Column({ default: 'user' })
  role: 'user' | 'admin' | 'seller';

  @Field(() => String)
  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
