import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { FollowsModule } from './follows/follows.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { FeedModule } from './feed/feed.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PaymentsModule } from './payments/payments.module';
import { ModerationModule } from './moderation/moderation.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    FollowsModule,
    PostsModule,
    AuthModule,
    FeedModule,
    EventEmitterModule.forRoot(),
    PaymentsModule,
    ModerationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
