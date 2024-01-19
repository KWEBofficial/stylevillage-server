import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import BaseTime from './baseTime.entity';
import User from './user.entity';
import Clothes from './clothes.entity';

@Entity()
export default class Wish extends BaseTime {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => User, {
    cascade: ['insert', 'recover', 'update'],
  })
  user!: User;

  @ManyToOne(() => Clothes, {
    cascade: ['insert', 'recover', 'update'],
  })
  clothes!: Clothes;

  @Column({
    type: 'boolean',
    default: false,
    nullable: false,
    comment: '찜 여부',
  })
  isWished!: boolean;
}
