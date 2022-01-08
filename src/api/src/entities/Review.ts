/* eslint-disable import/no-cycle */
import { Max, Min } from 'class-validator';
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
import { Product } from './Product';
import { User } from './User';

@ObjectType()
@Entity('reviews')
export class Review extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  readonly id!: number;

  @Field(() => String)
  @Column()
  title!: string;

  @Field(() => Int)
  @Column()
  @Min(1)
  @Max(5)
  rating!: number;

  @Field(() => String)
  @Column()
  comment!: string;

  @Field(() => Int)
  @Column()
  productId: number;

  @ManyToOne(() => Product, p => p.review, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Field(() => Int)
  @Column()
  creatorId: number;

  @ManyToOne(() => User, u => u.reviews)
  @JoinColumn({ name: 'creatorId' })
  creator: User;

  @Field(() => String)
  @CreateDateColumn({ type: 'date' })
  readonly createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn({ type: 'date' })
  updatedAt: Date;
}
