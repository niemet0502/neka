import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { Member } from 'src/members/entities/member.entity';
import { MembersService } from 'src/members/members.service';
import { StatusService } from 'src/status/status.service';
import { DEFAULT_TEAM_STATUS } from 'src/utils/constant';
import { User } from '../shared/user.entity';
import { CreateTeamInput } from './dto/create-team.input';
import { UpdateTeamInput } from './dto/update-team.input';
import { Team } from './entities/team.entity';

@Injectable()
export class TeamsService {
  private url = 'http://localhost:5002/teams/';

  constructor(
    private readonly http: HttpService,
    @Inject(forwardRef(() => MembersService))
    private readonly memberService: MembersService,
    private readonly statusService: StatusService,
  ) {}

  async create(createTeamInput: CreateTeamInput, user: User): Promise<Team> {
    // create team
    const { data } = await firstValueFrom(
      this.http.post<Team>(this.url, createTeamInput),
    );

    const { name, id: team_id } = data;

    // create a new member
    await this.memberService.create({ team_id, user_id: +user.id });

    // create default status
    DEFAULT_TEAM_STATUS.map(async (name) => {
      await this.statusService.create({ name, team_id });
    });
    return data;
  }

  async findAllByOrganization(organization_id: number): Promise<Team[]> {
    const { data } = await firstValueFrom(
      this.http.get<Team[]>(this.url, { params: { organization_id } }),
    );
    return data;
  }

  async findOne(id: number): Promise<Team> {
    const { data } = await firstValueFrom(
      this.http.get<Team>(`${this.url}${id}`),
    );
    return data;
  }

  async findBy(name: string): Promise<Team> {
    const { data } = await firstValueFrom(
      this.http.get<Team>(`${this.url}byName/${name}`).pipe(
        catchError((error: AxiosError) => {
          console.log(error.response.data);
          throw 'An error happened!';
        }),
      ),
    );
    return data;
  }

  async update(id: number, updateTeamInput: UpdateTeamInput): Promise<Team> {
    const { data } = await firstValueFrom(
      this.http.patch<Team>(`${this.url}${id}`, updateTeamInput),
    );
    return data;
  }

  async remove(id: number): Promise<Team> {
    const { data } = await firstValueFrom(
      this.http.delete<Team>(`${this.url}${id}`),
    );
    return { ...data, id };
  }

  async getMembers(team_id: number): Promise<Member[]> {
    return await this.memberService.findAllByTeam(team_id, undefined);
  }
}
