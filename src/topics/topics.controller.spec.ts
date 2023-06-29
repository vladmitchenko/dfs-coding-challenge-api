import { Test, TestingModule } from '@nestjs/testing';
import { TopicsController } from './topics.controller';
import { TopicsService } from './topics.service';

describe('TopicsController', () => {
  let controller: TopicsController;
  let service: TopicsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TopicsController],
    })
      .useMocker((token) => {
        if (token === TopicsService) {
          return { findAll: () => [] };
        }
        return {};
      })
      .compile();

    controller = module.get<TopicsController>(TopicsController);
    service = module.get<TopicsService>(TopicsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return topics', async () => {
    const result = [{ id: 1, name: 'Football', children: [], parent: null }];
    jest.spyOn(service, 'findAll').mockImplementation(async () => result);

    expect(await controller.getAll(0, 0)).toBe(result);
  });

  it('should call service with null value if parentId is not provided', async () => {
    const result = [{ id: 1, name: 'Football', children: [], parent: null }];
    const spy = jest
      .spyOn(service, 'findAll')
      .mockImplementation(async () => result);

    await controller.getAll(0, 0);

    expect(spy).toBeCalledWith(null, 0);
  });
});
