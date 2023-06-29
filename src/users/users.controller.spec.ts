import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserRole } from './enums/user-role';
import { UserStatus } from './enums/user-status';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
    })
      .useMocker((token) => {
        if (token === UsersService) {
          return { findAvailableAgents: jest.fn() };
        }
        return {};
      })
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return available agents', async () => {
    const result = [
      { id: 1, name: 'Alexa', role: UserRole.AGENT, status: UserStatus.FREE },
    ];
    jest
      .spyOn(service, 'findAvailableAgents')
      .mockImplementation(async () => result);

    expect(await controller.getAvailableAgents()).toBe(result);
  });
});
