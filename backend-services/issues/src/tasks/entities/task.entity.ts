import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Activity } from '../../activities/entities/activity.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { TaskLabel } from '../../labels/entities/label.entity';
import { Livrable } from '../../livrables/entities/livrable.entity';
import { Reminder } from '../../reminders/entities/reminder.entity';
import { Status } from '../../shared/status.entity';
import { TaskType } from '../../shared/tasks.enum';
import { Team } from '../../shared/team.entity';
import { User } from '../../shared/user.entity';
import { Sprint } from '../../sprints/entities/sprint.entity';

@ObjectType()
@Directive('@key(fields: "id")')
export class Task {
  @Field(() => ID)
  id: number;

  @Field({ nullable: false })
  slug: string;

  @Field({ nullable: false })
  name: string;

  @Field({ nullable: true })
  identifier?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  number: string;

  @Field()
  type: TaskType;

  @Field({ nullable: true })
  position?: number;

  @Field({ nullable: true })
  priority: number;

  @Field({ nullable: true })
  created_at?: string;

  @Field({ nullable: false })
  created_by: number;

  @Field(() => User)
  author?: User;

  @Field({ nullable: true })
  assignee_to: number;

  @Field(() => User, { nullable: true })
  assignee?: User;

  @Field({ nullable: true })
  parent_task_id: number;

  @Field({ nullable: true })
  sprint_id: number;

  @Field({ nullable: true })
  livrable_id: number;

  @Field((type) => Livrable, { nullable: true })
  livrable?: Livrable;

  @Field({ nullable: false })
  status_id: number;

  @Field((type) => Status)
  status?: Status;

  @Field({ nullable: false })
  team_id: number;

  @Field((type) => Team)
  team?: Team;

  @Field((type) => [Task])
  subtasks: Task[];

  @Field((type) => [Comment])
  comments: Comment[];

  @Field((type) => [Activity])
  activities: Activity[];

  @Field((type) => [TaskLabel])
  labels: TaskLabel[];

  @Field((type) => Sprint, { nullable: true })
  sprint?: Sprint;

  @Field((type) => [Reminder], { nullable: false })
  reminders?: Reminder[];
}
