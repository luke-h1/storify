/* eslint-disable import/no-cycle */
import { Field, Int, ObjectType } from 'type-graphql';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Cart } from './Cart';
import { OrderDetails } from './OrderDetails';
import { User } from './User';

@ObjectType()
@Entity('products')
export class Product extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  readonly id!: number;

  @Field(() => Int)
  @Column()
  creatorId: number;

  @ManyToOne(() => User, u => u.products, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creatorId' })
  creator: User;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => String)
  @Column()
  image: string;

  @Field(() => String)
  publicId(): String {
    const parts = this.image.split('/');
    return parts[parts.length - 1];
  }

  @Field(() => String)
  @Column()
  brand: string;

  @Field(() => String)
  @Column()
  stripeProductId: string;

  @Field(() => String)
  @Column()
  stripePriceId: string;

  @Field(() => String)
  @Column()
  description: string;

  @Field(() => Int)
  @Column()
  price: number;

  @Field(() => Boolean)
  @Column()
  liked: boolean;

  @Field(() => OrderDetails)
  @OneToMany(() => OrderDetails, od => od.product, { onDelete: 'CASCADE' })
  orderDetails: OrderDetails;

  @Field(() => Cart)
  @OneToMany(() => Cart, c => c.product, { onDelete: 'CASCADE' })
  cart: Cart;

  @Field(() => String)
  @CreateDateColumn({ type: 'date' })
  readonly createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn({ type: 'date' })
  updatedAt: Date;
}
