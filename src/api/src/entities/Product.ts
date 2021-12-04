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
import { CartItem } from './CartItem';
import { OrderItem } from './OrderItem';
import { User } from './User';

@ObjectType()
@Entity('products')
export class Product extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  creatorId: number;

  @ManyToOne(() => User, u => u.products)
  @JoinColumn({ name: 'creatorId' })
  creator: User;

  @Field(() => CartItem)
  @OneToMany(() => CartItem, cartItem => cartItem.productId)
  cartItem: CartItem[];

  @Field(() => [OrderItem])
  @OneToMany(() => OrderItem, orderItem => orderItem.productId)
  orderItem: OrderItem[];

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

  @Field(() => [String])
  @Column({ array: true, type: 'varchar' })
  categories: string[];

  @Field(() => String)
  @Column()
  description: string;

  @Field(() => Int)
  @Column()
  price: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
