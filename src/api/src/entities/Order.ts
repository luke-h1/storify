import { Entity, BaseEntity, PrimaryGeneratedColumn, ManyToMany, ManyToOne, JoinColumn, Column, JoinTable } from 'typeorm';
import { Product } from './Product';
import { User } from './User';



@Entity('orders')
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  creatorId: number;

  @ManyToOne(() => User, u => u.orders)
  @JoinColumn({ name: 'creatorId' })
  creator: User;


  @ManyToMany(() => Product)
  @JoinTable()
  procuts: Product[]
}