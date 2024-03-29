import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SprintsService } from '../sprints/sprints.service';
import { StatusService } from '../status/status.service';
import { CreateActivityDto } from '../tasks/dto/create-activity.dto';
import { Activity } from './entities/activity.entity';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity) private activitiesService: Repository<Activity>,
    // private readonly taskService: TasksService,
    private readonly statusService: StatusService,
    @Inject(forwardRef(() => SprintsService))
    private readonly sprintService: SprintsService,
  ) {}

  async create(createActivityDto: CreateActivityDto): Promise<Activity> {
    const { from_status, to_status, task_id, sprint_id } = createActivityDto;

    // const task = await this.taskService.findOne(task_id);

    // if (!task) {
    //   throw new NotFoundException('Task not found');
    // }

    const fStatus = from_status
      ? await this.statusService.findOne(from_status)
      : undefined;

    if (from_status && fStatus === undefined) {
      throw new NotFoundException('Status not found');
    }
    const tStatus = to_status
      ? await this.statusService.findOne(to_status)
      : undefined;

    if (to_status && tStatus === undefined) {
      throw new NotFoundException('Status not found');
    }

    const sprint = sprint_id
      ? await this.sprintService.findOne(sprint_id)
      : undefined;

    if (sprint_id && sprint === undefined) {
      throw new NotFoundException('Status not found');
    }

    return await this.activitiesService.save({
      ...createActivityDto,
      created_at: new Date().toString(),
      updated_at: new Date().toString(),
    });
  }

  async findAllByTask(task_id: number): Promise<Activity[]> {
    return await this.activitiesService.find({ where: { task_id } });
  }
}
