import {
  Injectable,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter, Schema, Types } from 'mongoose';
import { Follow, FollowDocument } from './schemas/follow.schema';
import { CreateFollowDto, DeleteFollowDto } from './dto/follow.dto';
import { QueryFollowersDto, QueryFollowingsDto } from './dto/query-follows.dto';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { PaginatedResult } from 'src/common/interface/paginated-result.interface';

@Injectable()
export class FollowsService {
  constructor(
    @InjectModel(Follow.name)
    private readonly followModel: Model<FollowDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async followUser(createFollowDto: CreateFollowDto): Promise<Follow> {
    const { followerId, followingId } = createFollowDto;

    if (followerId === followingId) {
      throw new BadRequestException('Users cannot follow themselves');
    }

    const followerObjectId = new Types.ObjectId(followerId);
    const followingObjectId = new Types.ObjectId(followingId);

    const targetUser = await this.userModel.findById(followingId).exec();

    if (!targetUser) {
      throw new NotFoundException('Target user not found');
    }

    const followFilter: QueryFilter<FollowDocument> = {
      followerId: followerId as any,
      followingId: followingId as any,
    };

    const existingFollow = await this.followModel.findOne(followFilter).exec();

    if (existingFollow) {
      throw new ConflictException('User is already following this user');
    }

    const follow = new this.followModel({
      followerId: followerObjectId,
      followingId: followingObjectId,
    });
    return await follow.save();
  }

  async unfollowUser(deleteFollowDto: DeleteFollowDto): Promise<string> {
    const { followerId, followingId } = deleteFollowDto;

    const followerObjectId = new Schema.Types.ObjectId(followerId);
    const followingObjectId = new Schema.Types.ObjectId(followingId);

    const followFilter: QueryFilter<FollowDocument> = {
      followerId: followerObjectId,
      followingId: followingObjectId,
    };

    const result = await this.followModel.findOneAndDelete(followFilter).exec();

    if (!result) {
      throw new NotFoundException('Follow relationship does not exist');
    }

    return 'Successfully unfollowed user';
  }

  async getFollowers(
    queryFollowersDto: QueryFollowersDto,
  ): Promise<PaginatedResult<Follow>> {
    const { page, limit, skip, followingId } = queryFollowersDto;

    const followersFilter: QueryFilter<FollowDocument> = {
      followingId: followingId as any,
    };

    const [data, total] = await Promise.all([
      this.followModel
        .find(followersFilter)
        .skip(skip)
        .limit(limit)
        .populate('followerId', 'username email displayName')
        .exec(),
      this.followModel.countDocuments(followersFilter).exec(),
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

  async getFollowings(
    queryFollowingDto: QueryFollowingsDto,
  ): Promise<PaginatedResult<Follow>> {
    const { page, limit, skip, followerId } = queryFollowingDto;

    const followingsFilter: QueryFilter<FollowDocument> = {
      followerId: followerId as any,
    };

    const [data, total] = await Promise.all([
      this.followModel
        .find(followingsFilter)
        .skip(skip)
        .limit(limit)
        .populate('followingId', 'username email displayName')
        .exec(),
      this.followModel.countDocuments(followingsFilter).exec(),
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

  // Get the list of user IDs the current user follows
  async getFollowingIds(userId: string): Promise<string[]> {
    const followingsFilter: QueryFilter<FollowDocument> = {
      followerId: userId as any,
    };

    const follows = await this.followModel
      .find(followingsFilter)
      .select('followingId')
      .exec();
    return follows.map((f) => f.followingId.toString());
  }

  async getFollowerIds(userId: string): Promise<string[]> {
    const followersFilter: QueryFilter<FollowDocument> = {
      followingId: userId as any,
    };

    const followers = await this.followModel
      .find(followersFilter)
      .select('followerId')
      .exec();
    return followers.map((f) => f.followerId.toString());
  }
}
