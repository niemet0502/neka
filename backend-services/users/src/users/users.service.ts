import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ProfilesService } from 'src/profiles/profiles.service';
import { Profile } from '../profiles/entities/profile.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private url = 'http://neka-data-access-1:3000/users/';

  constructor(
    private readonly http: HttpService,
    private readonly profileService: ProfilesService,
  ) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    const { data } = await firstValueFrom(
      this.http.post<User>(this.url, createUserInput),
    );
    return data;
  }

  async findAllByTeam(team_id: number): Promise<User[]> {
    const { data } = await firstValueFrom(
      this.http.get<User[]>(this.url, { params: { team_id } }),
    );
    return data;
  }

  async findOne(id: number): Promise<User> {
    const { data } = await firstValueFrom(this.http.get<User>(this.url + id));
    return data;
  }

  async update(id: number, updateUserInput: UpdateUserInput): Promise<User> {
    const { data } = await firstValueFrom(
      this.http.patch<User>(`${this.url}${id}`, updateUserInput),
    );
    return data;
  }

  async remove(id: number): Promise<User> {
    const { data } = await firstValueFrom(
      this.http.delete<User>(this.url + id),
    );
    return data;
  }

  async getUserProfile(user: User): Promise<Profile> {
    return await this.profileService.findOne(user.profile_id);
  }
}
