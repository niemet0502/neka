import { Test, TestingModule } from '@nestjs/testing';
import { SprintsResolver } from './sprints.resolver';
import { SprintsService } from './sprints.service';

describe('SprintsResolver', () => {
  let resolver: SprintsResolver;

  const sprintServiceMock = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SprintsResolver, SprintsService],
    })
      .overrideProvider(SprintsService)
      .useValue(sprintServiceMock)
      .compile();

    resolver = module.get<SprintsResolver>(SprintsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
