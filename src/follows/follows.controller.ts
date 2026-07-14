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
  UseGuards,
} from '@nestjs/common';
import { FollowsService } from './follows.service';
import { CreateFollowDto, DeleteFollowDto } from './dto/follow.dto';
import { UsersService } from 'src/users/users.service';
import { QueryFollowersDto, QueryFollowingsDto } from './dto/query-follows.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@Controller('follows')
@UseGuards(JwtAuthGuard)
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}
  // FOLLOW USER: POST /follows
  @Post()
  @HttpCode(HttpStatus.CREATED)
  followUser(
    @Body() createFollowDto: CreateFollowDto,
    @GetUser('userId') userId: string,
  ) {
    return this.followsService.followUser({
      ...createFollowDto,
      followerId: userId,
    });
  }

  // UNFOLLOW USER: DELETE /follows
  @Delete(':followingId')
  @HttpCode(HttpStatus.OK)
  unfollowUser(
    @Param('followingId') followingId: string,
    @GetUser('userId') userId: string,
  ) {
    const deleteFollowDto: DeleteFollowDto = {
      followerId: userId,
      followingId,
    };
    return this.followsService.unfollowUser(deleteFollowDto);
  }

  // GET FOLLOWERS: GET /follows/followers
  @Get('followers')
  getFollowers(
    @Query() queryFollowersDto: QueryFollowersDto,
    @GetUser('userId') userId: string,
  ) {
    queryFollowersDto.followingId = userId;
    return this.followsService.getFollowers(queryFollowersDto);
  }

  // GET FOLLOWINGS: GET /follows/followings
  @Get('followings')
  getFollowings(
    @Query() queryFollowingsDto: QueryFollowingsDto,
    @GetUser('userId') userId: string,
  ) {
    queryFollowingsDto.followerId = userId;
    return this.followsService.getFollowings(queryFollowingsDto);
  }
}
