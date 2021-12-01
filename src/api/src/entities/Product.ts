/* eslint-disable import/no-cycle */
import slugify from 'slugify';
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
  slug(): String {
    return slugify(this.name, {
      strict: true,
      lower: true,
    });
  }

  @Field(() => String)
  @Column()
  image: string;

  @Field(() => String)
  publicId(): String {
    const parts = this.image.split('/');
    return parts[parts.length - 1];
  }

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
  price: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
