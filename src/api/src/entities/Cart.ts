import { Field, Int, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User';

@ObjectType()
@Entity('cart')
export class Cart extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  readonly id!: number;

  @Field()
  @Column()
  creatorId: number;

  @ManyToOne(() => User, u => u.cart)
  @JoinColumn({ name: 'creatorId' })
  creator: User;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => String)
  @Column()
  image: string;

  @Field(() => Int)
  @Column()
  price: number;

  @Field(() => String)
  @Column()
  productId: string;

  @Field(() => Int)
  @Column()
  qty: number;

  @Field(() => String)
  @CreateDateColumn({ type: 'timestamp with time zone' })
  readonly createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
