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
import { FollowsService } from './follows.service';
import { CreateFollowDto, DeleteFollowDto } from './dto/follow.dto';
import { UsersService } from 'src/users/users.service';
import { QueryFollowersDto, QueryFollowingsDto } from './dto/query-follows.dto';

@Controller('follows')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}
  // FOLLOW USER: POST /follows
  @Post()
  @HttpCode(HttpStatus.CREATED)
  followUser(@Body() createFollowDto: CreateFollowDto) {
    return this.followsService.followUser(createFollowDto);
  }

  // UNFOLLOW USER: DELETE /follows
  @Delete()
  unfollowUser(@Body() deleteFollowDto: DeleteFollowDto) {
    return this.followsService.unfollowUser(deleteFollowDto);
  }

  // GET FOLLOWERS: GET /follows/followers
  @Get('followers')
  getFollowers(@Query() queryFollowersDto: QueryFollowersDto) {
    return this.followsService.getFollowers(queryFollowersDto);
  }

  // GET FOLLOWINGS: GET /follows/followings
  @Get('followings')
  getFollowings(@Query() queryFollowingsDto: QueryFollowingsDto) {
    return this.followsService.getFollowings(queryFollowingsDto);
  }
}
