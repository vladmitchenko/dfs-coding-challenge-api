import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { TopicsService } from './topics.service';
import { Topic } from './entities/topic.entity';

@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Get()
  async getAll(
    @Query('parentId', new DefaultValuePipe('0'), ParseIntPipe)
    parentId: number,
    @Query('depth', new DefaultValuePipe('2'), ParseIntPipe)
    depth: number,
  ): Promise<Topic[]> {
    return this.topicsService.findAll(parentId || null, depth);
  }
}
