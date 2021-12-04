/* eslint-disable import/no-cycle */
import { Field, Int, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderItem } from './OrderItem';
import { User } from './User';

@ObjectType()
@Entity('orders')
export class Order extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => [OrderItem])
  @OneToMany(() => OrderItem, orderItem => orderItem.orderId)
  orderItem: OrderItem[];

  @Field(() => User)
  @ManyToOne(() => User, user => user.orderId, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ referencedColumnName: 'id', name: 'userId' })
  userId: User;
}
