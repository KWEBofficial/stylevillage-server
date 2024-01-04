import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import BaseTime from './baseTime.entity';
import User from './user.entity';
import Clothes from './clothes.entity';


@Entity()
export default class Apply extends BaseTime {
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
    comment: '수락여부',
  })
  isAccepted!: boolean;

  @Column({
    type: 'boolean',
    default: false,
    nullable: false,
    comment: '거절여부',
  })
  isRejected!: boolean;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '세부내용',
  })
  detail?: string;
}