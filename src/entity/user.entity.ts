import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import BaseTime from './baseTime.entity';
import Gender from '../common/enum/gender.enum';
import Location from '../common/enum/city.enum';

@Entity()
@Unique(['username'])
export default class User extends BaseTime {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    comment: '아이디',
  })
  username!: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    comment: '암호화된 비밀번호',
  })
  password!: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: '닉네임',
  })
  nickname?: string;

  @Column({
    type: 'enum',
    enum: Gender,
    nullable: true,
    comment: '성별',
  })
  gender?: Gender;

  @Column({
    type: 'enum',
    enum: Location,
    nullable: true,
    comment: '지역',
  })
  location?: Location;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: '전화번호',
  })
  phoneNumber?: string;

  @Column({
    type: 'boolean',
    default: false,
    nullable: false,
    comment: '사용자 정지 여부',
  })
  isBanned?: boolean;
}
