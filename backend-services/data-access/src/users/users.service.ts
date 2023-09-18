import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ProfileService } from './profiles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private readonly orgaService: OrganizationsService,
    private readonly profileService: ProfileService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto;

    const user = await this.userRepo.findOne({ where: { email } });

    if (user) {
      throw new BadRequestException({ message: 'The email is already in use' });
    }

    createUserDto.password = await bcrypt.hash(password, 10);

    return await this.userRepo.save(createUserDto);
  }

  async findAllByTeam(organization_id: number): Promise<User[]> {
    return await this.userRepo.find({ where: { organization_id } });
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepo.findOne({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const toUpdate = await this.userRepo.findOne({
      where: { id },
    });

    const updated = Object.assign(toUpdate, updateUserDto);

    return await this.userRepo.save(updated);
  }

  async remove(id: number): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return await this.userRepo.remove(user);
  }
}
