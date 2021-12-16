/* eslint-disable import/no-cycle */
import { Field, ObjectType } from 'type-graphql';
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
@Entity('reviews')
export class Review extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  readonly id!: number;

  @Field(() => String)
  @Column()
  name!: string;

  @Field(() => Number)
  @Column()
  rating!: number;

  @Field(() => String)
  @Column()
  comment!: string;

  @Field()
  @Column()
  creatorId: number;

  @ManyToOne(() => User, u => u.reviews)
  @JoinColumn({ name: 'creatorId' })
  creator: User;

  @Field(() => String)
  @CreateDateColumn({ type: 'timestamp with time zone' })
  readonly createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
