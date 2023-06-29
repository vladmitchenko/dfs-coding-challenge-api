import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UserRole } from './enums/user-role';
import { UserStatus } from './enums/user-status';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    })
      .useMocker((token) => {
        if (token === 'UserRepository') {
          return { findBy: () => [] };
        }
        return {};
      })
      .compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>('UserRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return available agents', async () => {
    const result = [
      { id: 1, name: 'Alexa', role: UserRole.AGENT, status: UserStatus.FREE },
    ];
    jest.spyOn(repository, 'findBy').mockImplementation(async () => result);

    expect(await service.findAvailableAgents()).toBe(result);
  });
});
