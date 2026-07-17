import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { FeedService } from './feed.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { QueryFeedDto } from './dto/query-feed.dto';

@Controller('feed')
@UseGuards(JwtAuthGuard)
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get()
  getFeed(
    @GetUser('userId') userId: string,
    @Query() queryFeedDto: QueryFeedDto,
  ) {
    queryFeedDto.userId = userId;
    return this.feedService.getFeed(queryFeedDto);
  }
}
