import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserRole } from './enums/user-role';
import { UserStatus } from './enums/user-status';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findAvailableAgents(): Promise<User[]> {
    return this.usersRepository.findBy({
      role: UserRole.AGENT,
      status: UserStatus.FREE,
    });
  }
}
