/* eslint-disable import/no-cycle */
import { Exclude, Expose } from 'class-transformer';
import { Field } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderItem } from './OrderItem';

@Entity('orders')
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Exclude()
  firstName: string;

  @Column()
  @Exclude()
  lastName: string;

  @Field(() => String)
  @Column()
  email: string;

  @Field(() => String)
  @Column()
  TransactionId: string;

  @Field(() => String)
  @Column()
  address: string;

  @Field(() => String)
  @Column()
  city: string;

  @Field(() => String)
  @Column()
  country: string;

  @Field(() => String)
  @Column()
  zip: string;

  @Field(() => String)
  @Column()
  complete: string;

  @Field(() => [OrderItem])
  @OneToMany(() => OrderItem, orderItem => orderItem.order)
  orderItems: OrderItem[];

  @Field(() => String)
  @Expose()
  get name(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  @Field(() => Number)
  @Expose()
  get total(): number {
    return this.orderItems.reduce((sum, i) => sum + i.quantity * i.price, 0);
  }
}
