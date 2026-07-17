import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { Post, PostSchema } from 'src/posts/schemas/post.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { FollowsModule } from 'src/follows/follows.module';
import { PaymentsModule } from 'src/payments/payments.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Post.name,
        schema: PostSchema,
      },
    ]),
    FollowsModule,
    PaymentsModule,
  ],
  providers: [FeedService],
  controllers: [FeedController],
})
export class FeedModule {}
