import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { FollowsModule } from './follows/follows.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [DatabaseModule, UsersModule, FollowsModule, PostsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
