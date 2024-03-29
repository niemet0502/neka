import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateAnswerInput {
  @Field({ nullable: false })
  content: string;

  @Field({ nullable: true })
  created_by: number;

  @Field({ nullable: false })
  question_id: number;
}
