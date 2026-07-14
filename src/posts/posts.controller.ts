import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { UpdatePostStatusDto } from './dto/update-post-status.dto';
import { QueryPostsDto } from './dto/query-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // CREATE POST: POST /posts
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  // GET ALL POSTS: GET /posts
  @Get()
  findAll(@Query() queryPostsDto: QueryPostsDto) {
    return this.postsService.findAll(queryPostsDto);
  }

  // GET ONE POST: GET /posts/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  // UPDATE POST: PATCH /posts/:id
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  // UPDATE POST STATUS: PATCH /posts/:id/status
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updatePostStatusDto: UpdatePostStatusDto,
  ) {
    return this.postsService.updateStatus(id, updatePostStatusDto);
  }

  // DELETE POST: DELETE /posts/:id
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.delete(id);
  }
}
