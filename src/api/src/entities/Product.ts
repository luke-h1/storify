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
} from 'typeorm';
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

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => String)
  @Column()
  image: string;

  @Field(() => String)
  @Column()
  brand: string;

  @Field(() => String)
  @Column()
  category: string;

  @Field(() => String)
  @Column()
  description: string;

  @Field(() => Number)
  @Column()
  numReviews: number;

  @Field(() => Number)
  @Column()
  price: number;

  @Field(() => Number)
  @Column()
  countInStock: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
