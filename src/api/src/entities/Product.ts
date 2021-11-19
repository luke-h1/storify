import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Review } from './Review';
import { User } from './User';

@Entity('products')
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  creatorId: number;

  @ManyToOne(() => User, u => u.products)
  @JoinColumn({ name: 'creatorId' })
  creator: User;

  @ManyToMany(() => Review)
  @JoinTable()
  reviews: Review[];

  @Column()
  name: string;

  @Column()
  brand: string;

  @Column()
  category: string;

  @Column()
  description: string;

  @Column()
  numReviews: number;

  @Column()
  price: number;

  @Column()
  countInStock: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
