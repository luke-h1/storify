import { Max, Min } from 'class-validator';
import { Field, Int, ObjectType } from 'type-graphql';
import {
  Entity,
  BaseEntity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Product } from './Product';
import { User } from './User';

@ObjectType()
@Entity('cart')
export class Cart extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  readonly id!: number;

  @Field(() => Int)
  @Column()
  @Min(1)
  @Max(10)
  @Column()
  quantity: number;

  @Field(() => Int)
  @Column()
  creatorId: number;

  @ManyToOne(() => User, u => u.cart, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creatorId' })
  creator: User;

  @Field(() => Int)
  @Column()
  productId: number;

  @Field(() => Product)
  @ManyToOne(() => Product, p => p.cart, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Field(() => Int)
  total(): number {
    return this.product.price * this.quantity;
  }

  @Field(() => String)
  @CreateDateColumn({ type: 'date' })
  readonly createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn({ type: 'date' })
  updatedAt: Date;
}
