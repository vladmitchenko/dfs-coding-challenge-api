import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { TopicsModule } from './topics/topics.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './database/customer_service.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
    UsersModule,
    TopicsModule,
  ],
})
export class AppModule {}
