import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import BaseTime from './baseTime.entity';
import Closet from './closet.entity';
import User from './user.entity';
import Category from '../common/enum/category.enum';
import Season from '../common/enum/season.enum';
import Status from '../common/enum/status.enum';

@Entity()
export default class Clothes extends BaseTime {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Closet, {
    cascade: ['insert', 'recover', 'update'],
  })
  closet?: Closet;

  @ManyToOne(() => User, {
    cascade: ['insert', 'recover', 'update'],
  })
  owner!: User;

  @Column({
    type: 'varchar',
    length: 1000,
    nullable: true,
    comment: '설명',
  })
  description?: string;

  @Column({
    type: 'enum',
    enum: Category,
    nullable: true,
    comment: '카테고리',
  })
  category?: Category;

  @Column({
    type: 'enum',
    enum: Season,
    nullable: true,
    comment: '계절',
  })
  season?: Season;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.UNAVAILABLE,
    nullable: false,
    comment: '상태',
  })
  status!: Status;

  @Column({
    type: 'boolean',
    default: true,
    nullable: false,
    comment: '공개여부',
  })
  isOpen!: boolean;

  @Column({
    type: 'varchar',
    length: 30,
    nullable: false,
    comment: '이름',
  })
  name!: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: '태그',
  })
  tag?: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: '이미지',
  })
  image?: string;
}
