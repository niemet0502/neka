import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusModule } from 'src/status/status.module';
import { TasksModule } from 'src/tasks/tasks.module';
import { TeamsModule } from 'src/teams/teams.module';
import { Sprint } from './entities/sprint.entity';
import { SprintsController } from './sprints.controller';
import { SprintsService } from './sprints.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sprint]),
    TeamsModule,
    forwardRef(() => TasksModule),
    StatusModule,
  ],
  controllers: [SprintsController],
  providers: [SprintsService],
  exports: [SprintsService],
})
export class SprintsModule {}
