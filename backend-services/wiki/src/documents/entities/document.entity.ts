import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../../shared/user.entity';
import { DocumentStatus } from '../documents.enum';

@ObjectType()
export class Document {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  folder_id?: number;

  @Field({ nullable: true })
  team_id?: number;

  @Field({ nullable: true })
  content?: string;

  @Field()
  status: DocumentStatus;

  @Field()
  created_by: number;

  @Field(() => User)
  author?: User;

  @Field()
  created_at: string;

  @Field()
  updated_at: string;
}
