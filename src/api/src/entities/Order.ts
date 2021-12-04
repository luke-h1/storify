/* eslint-disable import/no-cycle */
import { Exclude, Expose } from 'class-transformer';
import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';

@ObjectType()
@Entity('orders')
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string; // person who made the order

  @Column()
  lastName: string; // person who made the order

  @Field(() => String)
  @Column()
  address: string;

  @Field(() => Number)
  @Column()
  creatorId: number;

  @ManyToOne(() => User, u => u.orders)
  @JoinColumn({ name: 'creatorId' })
  creator: User;

  @Field(() => String)
  @Column()
  city: string;

  @Field(() => String)
  @Column()
  country: string;

  @Field(() => String)
  @Column()
  postalCode: string;

  @Field(() => Boolean)
  @Column({ default: false })
  isPaid: boolean;

  @Field(() => Number)
  @Column()
  paidAt: number;

  @Field(() => Boolean)
  @Column({ default: false })
  isDelivered: boolean;

  @Field(() => Number)
  @Column()
  deliveredAt: number;

  @Field(() => Boolean)
  @Column({ default: false })
  complete: boolean; // true when order is finished

  @Field(() => String)
  get name(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
