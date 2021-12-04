/* eslint-disable import/no-cycle */
import { Exclude, Expose } from 'class-transformer';
import { Field } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Link } from './Link';
import { OrderItem } from './OrderItem';

@Entity('orders')
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Exclude()
  firstName: string; // person who made the order

  @Column()
  @Exclude()
  lastName: string; // person who made the order

  @Field(() => String)
  @Column()
  email: string; // email of seller

  @Field(() => String)
  @Column()
  code: string;

  @Field(() => String)
  @Column({ nullable: true })
  TransactionId: string; // stripe payment ID

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

  @Field(() => Boolean)
  @Column({ default: false })
  complete: boolean; // true when order is finished

  @ManyToOne(() => Link, link => link.orders, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({
    referencedColumnName: 'code',
    name: 'code',
  })
  link: Link;

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
