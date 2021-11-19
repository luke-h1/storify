import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User';

@Entity('reviews')
export class Review extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;
  
  @Column()
  name!: string;

  @Column()
  rating!: number;
  
  @Column()
  comment!: string;

  @Column()
  creatorId: number;

  @ManyToOne(() => User, u => u.reviews)
  @JoinColumn({ name: 'creatorId' })
  creator: User;
}
