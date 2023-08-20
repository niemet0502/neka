import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TaskType } from '../tasks.enum';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: false })
  slug: string;

  @Column('text', { nullable: false })
  name: string;

  @Column({
    type: 'enum',
    enum: TaskType,
    default: TaskType.ISSUE,
  })
  type: TaskType.ISSUE;

  @Column({ nullable: true })
  priority: number;

  @Column({ nullable: false })
  created_by: number;

  @Column({ nullable: true })
  parent_task_id: number;

  @Column({ nullable: false })
  sprint_id: number;

  @Column({ nullable: false })
  status_id: number;
}
