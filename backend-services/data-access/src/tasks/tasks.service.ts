import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivitiesService } from '../activities/activities.service';
import { StatusService } from '../status/status.service';
import { TeamsService } from '../teams/teams.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { ActivityAction, TaskType } from './tasks.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
    private readonly statusService: StatusService,
    private readonly teamService: TeamsService,
    @Inject(forwardRef(() => ActivitiesService))
    private readonly activityService: ActivitiesService,
  ) {}
  async create(createTaskDto: CreateTaskDto) {
    const { team_id, status_id, parent_task_id, created_by, slug } =
      createTaskDto;

    // check if the team exists
    const team = await this.teamService.findOne(team_id);

    if (!team) {
      throw new NotFoundException("The team doesn't exist ");
    }

    // check if the status exists
    const status = status_id
      ? await this.statusService.findOne(status_id)
      : await this.statusService.findBy({
          where: { name: 'Backlog' },
        });

    if (!status) {
      throw new NotFoundException("The status doesn't exist ");
    }

    // if the parent_task_id exist check if the task exist

    if (parent_task_id) {
      const parent = await this.taskRepository.findOne({
        where: { id: parent_task_id },
      });

      if (!parent) {
        throw new NotFoundException("The parent doesn't exist ");
      }
    }

    const maxId = await this.findMaxId();
    const id = `${team.identifier}-${maxId}`;
    const position = await this.calculatePosition(team.id, status_id);

    const task = await this.taskRepository.save({
      ...createTaskDto,
      position,
      status_id: status.id,
      identifier: id,
      created_at: new Date().toString(),
      slug: `${id.toLowerCase()}-${slug}`,
    });

    // create the activity
    await this.activityService.create({
      task_id: task.id,
      created_by,
      action: ActivityAction.CREATE_ISSUE,
      from_status: undefined,
      to_status: undefined,
      sprint_id: undefined,
    });

    return task;
  }

  async findAll(
    team_id: number,
    type: TaskType,
    status_name: string,
    parent_task_id: number,
    sprint_id: number,
    sprint_history: number,
    livrable_id: number,
    sort: 'DESC' | 'ASC',
    sortBy?: string,
  ): Promise<Task[]> {
    const query = this.taskRepository.createQueryBuilder('task');

    const status = status_name
      ? await this.statusService.findBy({ where: { name: status_name } })
      : undefined;

    if (team_id) {
      query.andWhere('task.team_id = :team_id', { team_id });
    }

    if (livrable_id) {
      query.andWhere('task.livrable_id = :livrable_id', { livrable_id });
    }

    if (status && status_name) {
      query.andWhere('task.status_id = :status_id', { status_id: status.id });
    }

    if (type) {
      query.andWhere('task.type = :type', { type });
    }

    if (parent_task_id) {
      query.andWhere('task.parent_task_id = :parent_task_id', {
        parent_task_id,
      });
    }

    if (sprint_id) {
      query.andWhere('task.sprint_id = :sprint_id', {
        sprint_id,
      });
    }

    if (sprint_history) {
      query.andWhere('task.sprint_history = :sprint_history', {
        sprint_history,
      });
    }

    query.orderBy(`task.${sortBy || 'id'}`, sort);
    return await query.getMany();
  }

  async findOne(id: number): Promise<Task> {
    return await this.taskRepository.findOne({ where: { id } });
  }

  async findBy(option: any): Promise<Task> {
    return await this.taskRepository.findOne(option);
  }

  async findAllBy(option: any): Promise<Task[]> {
    return await this.taskRepository.find(option);
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const {
      action,
      created_by,
      status_id: to_status,
      priority,
      assignee_to,
      livrable_id,
    } = updateTaskDto;

    const toUpdate = await this.taskRepository.findOne({
      where: { id },
    });

    const { status_id: from_status } = toUpdate;

    let updated = Object.assign(toUpdate, updateTaskDto);

    // create the activity
    const activity = { created_by, action, task_id: id };
    let value = undefined;

    if (action === ActivityAction.CHANGED_STATUS) {
      value = {
        from_status,
        to_status,
      };
    } else if (action === ActivityAction.ADDED_SPRINT) {
      value = { sprint_id: updateTaskDto.sprint_id };

      const newStatus = await this.statusService.findBy({
        where: { name: 'Todo' },
      });

      updated = { ...updated, status_id: newStatus.id };
    } else if (action === ActivityAction.ADDED_PROJECT) {
      value = { livrable_id };
    } else if (action === ActivityAction.SET_PRIORITY) {
      value = { priority };
    } else if (action === ActivityAction.ASSIGNED) {
      value = { assignee_to };
    }

    await this.activityService.create({ ...activity, ...value });

    return await this.taskRepository.save(updated);
  }

  async remove(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });

    if (!task) {
      throw new NotFoundException('task not found');
    }

    return await this.taskRepository.remove(task);
  }

  async findMaxId(): Promise<number> {
    const queryBuilder = this.taskRepository.createQueryBuilder('task');
    queryBuilder.select('MAX(task.id)', 'maxId');

    const result = await queryBuilder.getRawOne();
    const maxId = result?.maxId;

    return maxId ? parseInt(maxId) : 1;
  }

  async calculatePosition(team_id: number, status_id: number) {
    const tasks = await this.taskRepository.find({
      where: { team_id, status_id },
    });

    const listPositions = tasks.map(({ position }) => position);

    if (listPositions.length > 0) {
      return Math.min(...listPositions) - 1;
    }
    return 1;
  }

  async save(entities: any) {
    return await this.taskRepository.save(entities);
  }
}
