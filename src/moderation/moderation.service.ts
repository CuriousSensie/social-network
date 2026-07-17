import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../posts/schemas/post.schema';
import { UpdatePostStatusDto } from '../posts/dto/update-post-status.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginatedResult } from 'src/common/interface/paginated-result.interface';

@Injectable()
export class ModerationService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async getUnbiasedPosts(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<PaginatedResult<Post>> {
    const { page, limit, skip } = paginationQueryDto;

    const [data, total] = await Promise.all([
      this.postModel
        .find()
        .select('-authorId') // Remove Bias
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.postModel.countDocuments().exec(),
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

  async updatePostStatus(id: string, updatePostStatusDto: UpdatePostStatusDto) {
    const updatedPost = await this.postModel
      .findByIdAndUpdate(
        id,
        { status: updatePostStatusDto.status },
        { new: true },
      )
      .select('-authorId')
      .exec();

    if (!updatedPost) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return updatedPost;
  }
}
