import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter, Types } from 'mongoose';
import { Post, PostDocument } from '../posts/schemas/post.schema';
import { FollowsService } from '../follows/follows.service';
import { PostStatus } from '../posts/enums/post-status.enum';
import { QueryFeedDto } from './dto/query-feed.dto';
import { PaginatedResult } from 'src/common/interface/paginated-result.interface';
import { PaymentsService } from 'src/payments/payments.service';

@Injectable()
export class FeedService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    private followsService: FollowsService,
    private paymentsService: PaymentsService,
  ) {}

  async getFeed(queryFeedDto: QueryFeedDto): Promise<PaginatedResult<Post>> {
    const { page, limit, skip, sortBy, sortOrder, userId } = queryFeedDto;

    await this.paymentsService.requirePaidAccess(userId);

    const followingIds = await this.followsService.getFollowingIds(userId);

    if (followingIds.length === 0) {
      return {
        data: [],
        meta: {
          totalItems: 0,
          itemCount: 0,
          itemsPerPage: limit,
          totalPages: 0,
          currentPage: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
    }

    const followingObjectIds = followingIds.map(
      (id) => new Types.ObjectId(id) as any,
    );

    const query: QueryFilter<PostDocument> = {
      authorId: { $in: followingObjectIds },
      status: PostStatus.ACTIVE,
    };

    const sortConfig = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const [data, total] = await Promise.all([
      this.postModel
        .find(query)
        .sort(sortConfig as any)
        .skip(skip)
        .limit(limit)
        .populate('authorId', 'username displayName accessStatus')
        .exec(),
      this.postModel.countDocuments(query).exec(),
    ]);

    return {
      data,
      meta: {
        totalItems: total,
        itemCount: data.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1,
      },
    };
  }
}
