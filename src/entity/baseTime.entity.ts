import { CreateDateColumn, DeleteDateColumn, Entity } from 'typeorm';

@Entity()
export default abstract class BaseTime {
  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
