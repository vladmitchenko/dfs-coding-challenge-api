import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('available-agents')
  async getAvailableAgents(): Promise<User[]> {
    return this.usersService.findAvailableAgents();
  }
}
