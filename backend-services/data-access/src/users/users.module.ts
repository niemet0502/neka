import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from '../logger/logger.module';
import { Profile } from './entities/profile.entity';
import { User } from './entities/user.entity';
import { ProfileController } from './profiles.controller';
import { ProfileService } from './profiles.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile]), LoggerModule],
  controllers: [UsersController, ProfileController],
  providers: [UsersService, ProfileService],
  exports: [UsersService],
})
export class UsersModule {}
