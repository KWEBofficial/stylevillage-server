import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import BaseTime from './baseTime.entity';
import User from './user.entity';
import Clothes from './clothes.entity';

@Entity()
export default class Lend extends BaseTime {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => Clothes, {
    cascade: ['insert', 'recover', 'update'],
  })
  clothes!: Clothes;

  @Column({
    type: 'int',
    nullable: false,
    comment: '가격',
  })
  price!: number;

  @Column({
    type: 'timestamp',
    nullable: false,
    comment: '대여시작날짜',
  })
  startDate!: Date;

  @Column({
    type: 'timestamp',
    nullable: false,
    comment: '대여마감날짜',
  })
  endDate!: Date;

  @ManyToOne(() => User, {
    cascade: ['insert', 'recover', 'update'],
  })
  lender!: User;

  @ManyToOne(() => User, {
    cascade: ['insert', 'recover', 'update'],
  })
  loanee!: User;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '대여리뷰',
  })
  review?: string;
}
