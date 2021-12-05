import { Field, Int, ObjectType } from 'type-graphql';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { OrderItem } from './OrderItem';
import { User } from './User';

@ObjectType()
@Entity('orders')
export class Order extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  readonly id!: number;

  @Field(() => String)
  @Column()
  firstName: string;

  @Field(() => String)
  @Column()
  lastName: string;

  @Field(() => String)
  @Column()
  email: string;

  @Field(() => String)
  @Column()
  address: string;

  @Field(() => String)
  @Column()
  country: string;

  @Field(() => String)
  @Column()
  city: string;

  @Field(() => String)
  @Column()
  postCode: string;

  @Field(() => String)
  @Column({ nullable: true })
  transactionId: string;

  @Field()
  @Column()
  creatorId: number;

  @ManyToOne(() => User, u => u.orders)
  @JoinColumn({ name: 'creatorId' })
  creator: User;

  @Field(() => [OrderItem])
  @OneToMany(() => OrderItem, orderItem => orderItem.order)
  // @Column({ array: true, type: 'varchar' })
  orderItems: OrderItem[];

  @Field(() => String)
  @CreateDateColumn({ type: 'timestamp with time zone' })
  readonly createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
