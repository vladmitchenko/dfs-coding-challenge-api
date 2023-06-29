import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeRepository } from 'typeorm';
import { Topic } from './entities/topic.entity';

@Injectable()
export class TopicsService {
  constructor(
    @InjectRepository(Topic)
    private readonly topicsRepository: TreeRepository<Topic>,
  ) {}

  async findAll(parentId: number | null, depth: number): Promise<Topic[]> {
    if (parentId) {
      const parent = new Topic();
      parent.id = parentId;
      const tree = await this.topicsRepository.findDescendantsTree(parent, {
        depth: depth + 1,
      });
      return tree.children;
    }
    return this.topicsRepository.findTrees({ depth });
  }
}
