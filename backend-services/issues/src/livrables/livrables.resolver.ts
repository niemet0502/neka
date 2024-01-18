import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  ResolveReference,
  Resolver,
} from '@nestjs/graphql';
import { User } from '../shared/user.entity';
import { CreateLivrableInput } from './dto/create-livrable.input';
import { UpdateLivrableInput } from './dto/update-livrable.input';
import { Livrable } from './entities/livrable.entity';
import { LivrablesService } from './livrables.service';

@Resolver(() => Livrable)
export class LivrablesResolver {
  constructor(private readonly livrablesService: LivrablesService) {}

  @Mutation(() => Livrable)
  createLivrable(
    @Args('createLivrableInput') createLivrableInput: CreateLivrableInput,
  ) {
    return this.livrablesService.create(createLivrableInput);
  }

  @Query(() => [Livrable], { name: 'livrables' })
  findAll(@Args('team_id', { type: () => Int }) team_id: number) {
    return this.livrablesService.findAll(team_id);
  }

  @Query(() => Livrable, { name: 'livrable' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.livrablesService.findOne(id);
  }

  @Mutation(() => Livrable)
  updateLivrable(
    @Args('updateLivrableInput') updateLivrableInput: UpdateLivrableInput,
  ) {
    return this.livrablesService.update(
      updateLivrableInput.id,
      updateLivrableInput,
    );
  }

  @Mutation(() => Livrable)
  removeLivrable(@Args('id', { type: () => Int }) id: number) {
    return this.livrablesService.remove(id);
  }

  @ResolveField(() => User)
  author(@Parent() task: Livrable): any {
    return { __typename: 'User', id: task.created_by };
  }

  @ResolveReference()
  async resolveReference(reference: {
    __typename: string;
    id: number;
  }): Promise<Livrable> {
    return await this.livrablesService.findOne(reference.id);
  }
}