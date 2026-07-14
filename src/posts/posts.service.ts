import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { Model, QueryFilter } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { QueryPostsDto } from './dto/query-post.dto';
import { PaginatedResult } from 'src/common/interface/paginated-result.interface';
import { PostStatus } from './enums/post-status.enum';
import { UpdatePostDto } from './dto/update-post.dto';
import { UpdatePostStatusDto } from './dto/update-post-status.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const newPost = new this.postModel(createPostDto);
    const savedPost = await newPost.save();

    const populatedPost = await savedPost.populate(
      'authorId',
      'username displayName',
    );

    this.eventEmitter.emit('post.created', populatedPost);

    return populatedPost;
  }

  async findAll(queryPostsDto: QueryPostsDto): Promise<PaginatedResult<Post>> {
    const { page, limit, skip, search, authorId, status } = queryPostsDto;

    const postsFilter: QueryFilter<PostDocument> = {};

    if (search) {
      postsFilter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    if (authorId) {
      postsFilter.authorId = authorId as any;
    }

    if (status) {
      postsFilter.status = PostStatus[status];
    } else {
      postsFilter.status = PostStatus.ACTIVE;
    }

    const [data, total] = await Promise.all([
      this.postModel
        .find(postsFilter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.postModel.countDocuments(postsFilter).exec(),
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

  async findOne(id: string): Promise<Post> {
    const post = await this.postModel
      .findById(id)
      .populate('authorId', 'username displayName')
      .exec();

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    const updatedPost = await this.postModel
      .findByIdAndUpdate(id, updatePostDto)
      .exec();

    if (!updatedPost) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return updatedPost;
  }

  async updateStatus(
    id: string,
    updatePostStatusDto: UpdatePostStatusDto,
  ): Promise<Post> {
    const { status } = updatePostStatusDto;

    const updatedPost = await this.postModel
      .findByIdAndUpdate(id, { status })
      .exec();

    if (!updatedPost) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return updatedPost;
  }

  async delete(id: string): Promise<Post> {
    const deletedPost = await this.postModel.findByIdAndDelete(id).exec();

    if (!deletedPost) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return deletedPost;
  }
}
