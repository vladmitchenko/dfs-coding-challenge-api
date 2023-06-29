import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TreeRepository } from 'typeorm';
import { TopicsModule } from '../src/topics/topics.module';
import { Topic } from '../src/topics/entities/topic.entity';

const testData = [
  {
    id: 1,
    name: 'Football',
    children: [
      {
        id: 2,
        name: 'Premier League',
        children: [
          {
            id: 3,
            name: 'Liverpool',
            children: [],
          },
        ],
      },
      {
        id: 4,
        name: 'Seria A',
        children: [
          {
            id: 5,
            name: 'Milan',
            children: [],
          },
        ],
      },
    ],
  },
] as Topic[];

const seedTreeData = async (data: Topic[], repository: TreeRepository<Topic>) =>
  Promise.all(
    data.map(async (item) => {
      await repository.save({ ...item, children: [] });
      return seedTreeData(
        item.children.map((t) => ({ ...t, parent: item })),
        repository,
      );
    }),
  );

describe('TopicsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: './database/test.sqlite',
          entities: [Topic],
          synchronize: true,
        }),
        TopicsModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const repository =
      moduleFixture.get<TreeRepository<Topic>>('TopicRepository');
    await repository.clear();
    await seedTreeData(testData, repository);
  });

  it('/topics (GET)', () => {
    const result = testData;
    return request(app.getHttpServer())
      .get('/topics')
      .expect(200)
      .expect(result);
  });

  it('/topics?depth=0 (GET)', () => {
    const result = testData.map((item) => ({ ...item, children: [] }));
    return request(app.getHttpServer())
      .get('/topics?depth=0')
      .expect(200)
      .expect(result);
  });

  it('/topics?parentId=1 (GET)', () => {
    const result = testData.find((item) => item.id === 1).children;
    return request(app.getHttpServer())
      .get('/topics?parentId=1')
      .expect(200)
      .expect(result);
  });

  it('/topics?parentId=1&depth=0 (GET)', () => {
    const result = testData
      .find((item) => item.id === 1)
      .children.map((item) => ({ ...item, children: [] }));
    return request(app.getHttpServer())
      .get('/topics?parentId=1&depth=0')
      .expect(200)
      .expect(result);
  });
});
