import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersModule } from '../src/users/users.module';
import { User } from '../src/users/entities/user.entity';

const testData = [
  { id: 1, name: 'Alexa', role: 'supervisor', status: 'offline' },
  { id: 2, name: 'Siri', role: 'agent', status: 'free' },
  { id: 3, name: 'Cortana', role: 'agent', status: 'free' },
  { id: 4, name: 'Bixby', role: 'agent', status: 'buisy' },
] as User[];

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: './database/test.sqlite',
          entities: [User],
          synchronize: true,
        }),
        UsersModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const repository = moduleFixture.get<Repository<User>>('UserRepository');
    await repository.clear();
    await repository.save(testData);
  });

  it('/users/available-agents (GET)', () => {
    const result = [testData[1], testData[2]];
    return request(app.getHttpServer())
      .get('/users/available-agents')
      .expect(200)
      .expect(result);
  });
});
