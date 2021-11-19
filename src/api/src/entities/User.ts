import { Length } from 'class-validator'
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Order } from './Order';
import { Product } from './Product';
import { Review } from './Review';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Length(7, 20)
  password: string;

  @OneToMany(() => Product, p => p.creator)
  products: Product[];

  @OneToMany(() => Review, r => r.creator)
  reviews: Review[];

  @OneToMany(() => Order, o => o.creator)
  orders: Order[];

  @Column()
  image: string;

  @Column()
  s3ImageFileName: string;

  @Column({ default: false })
  isAdmin: Boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;


}
