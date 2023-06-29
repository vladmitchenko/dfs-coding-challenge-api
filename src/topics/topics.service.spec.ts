import { Test, TestingModule } from '@nestjs/testing';
import { TreeRepository } from 'typeorm';
import { TopicsService } from './topics.service';
import { Topic } from './entities/topic.entity';

describe('TopicsService', () => {
  let service: TopicsService;
  let repository: TreeRepository<Topic>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TopicsService],
    })
      .useMocker((token) => {
        if (token === 'TopicRepository') {
          return { findTrees: () => [], findDescendantsTree: () => ({}) };
        }
        return {};
      })
      .compile();

    service = module.get<TopicsService>(TopicsService);
    repository = module.get<TreeRepository<Topic>>('TopicRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return root topics when parentId is not provided', async () => {
    const result = [{ id: 1, name: 'Football', children: [], parent: null }];
    const spy = jest
      .spyOn(repository, 'findTrees')
      .mockImplementation(async () => result);

    expect(await service.findAll(null, 0)).toBe(result);
    expect(spy).toBeCalledTimes(1);
  });

  it('should return children topics when parentId is provided', async () => {
    const repositoryResponse = {
      id: 1,
      name: 'Football',
      children: [
        {
          id: 2,
          name: 'Premier League',
          children: [],
          parent: null,
        },
      ],
      parent: null,
    };
    const result = repositoryResponse.children;
    const spy = jest
      .spyOn(repository, 'findDescendantsTree')
      .mockImplementation(async () => repositoryResponse);

    expect(await service.findAll(1, 0)).toBe(result);
    expect(spy).toBeCalledTimes(1);
  });
});
