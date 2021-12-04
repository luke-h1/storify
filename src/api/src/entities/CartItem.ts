import { Field, Int, ObjectType } from 'type-graphql';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cart } from './Cart';
import { Product } from './Product';

@ObjectType()
@Entity()
export class CartItem extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column('smallint')
  quantity: number;

  @Field(() => Cart)
  @ManyToOne(() => Cart, cart => cart.cartItem, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'cartId' })
  cartId: Cart;

  @Field(() => Product)
  @ManyToOne(() => Product, product => product.cartItem, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  productId: Product;
}
