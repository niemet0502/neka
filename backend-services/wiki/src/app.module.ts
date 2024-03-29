import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AnswersModule } from './answers/answers.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocumentsModule } from './documents/documents.module';
import { FoldersModule } from './folders/folders.module';
import { LoggerModule } from './logger/logger.module';
import { RequestLoggingMiddleware } from './middleware/request-logging.middleware';
import { QuestionsModule } from './questions/questions.module';
import { Livrable } from './shared/livrable.entity';
import { Task } from './shared/task.entity';
import { Team } from './shared/team.entity';
import { User } from './shared/user.entity';
import { VotesModule } from './votes/votes.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
      buildSchemaOptions: {
        orphanedTypes: [User, Team, Task, Livrable],
      },
    }),
    DocumentsModule,
    FoldersModule,
    QuestionsModule,
    AnswersModule,
    VotesModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggingMiddleware).forRoutes('*');
  }
}
