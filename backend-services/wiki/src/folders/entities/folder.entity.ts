import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Document } from '../../documents/entities/document.entity';
import { Team } from '../../shared/team.entity';
import { User } from '../../shared/user.entity';

@ObjectType()
export class Folder {
  @Field(() => Int)
  id: number;

  @Field({ nullable: false })
  name: string;

  @Field({ nullable: false })
  team_id: number;

  @Field({ nullable: true })
  created_by: number;

  @Field((type) => User, { nullable: true })
  author?: User;

  @Field((type) => Team)
  team?: Team;

  @Field((type) => [Document])
  documents: Document[];
}
