/* eslint-disable import/no-cycle */
import { Field, Int, ObjectType } from 'type-graphql';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { CartItem } from './CartItem';
import { User } from './User';

@ObjectType()
@Entity()
export class Cart extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, user => user.cartId, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  userId: User;

  @OneToMany(() => CartItem, cartItem => cartItem.cartId)
  cartItem: CartItem[];
}
