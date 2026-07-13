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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { FindUserDto } from './dto/find-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { PaginatedResult } from 'src/common/interface/paginated-result.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // CREATE USER: POST /users
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }

  // GET ALL USERS (PAGINATED): GET /users?page=1&limit=10&search=haz
  @Get()
  async findAll(
    @Query() queryUserDto: QueryUsersDto,
  ): Promise<PaginatedResult<User>> {
    return await this.usersService.findAll(queryUserDto);
  }

  // LOOKUP USER BY IDENTIFIER: GET /users/search?email=test@test.com
  @Get('search')
  async findOne(@Query() findUserDto: FindUserDto): Promise<User> {
    return await this.usersService.findOne(findUserDto);
  }

  // GET SINGLE USER BY ID: GET /users/:id
  @Get(':id')
  async findById(@Param('id') id: string): Promise<User> {
    return await this.usersService.findById(id);
  }

  // UPDATE USER PROPERTIES: PATCH /users/:id
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.update(id, updateUserDto);
  }

  // DELETE USER DOCUMENT: DELETE /users/:id
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<User> {
    return await this.usersService.deletedUser(id);
  }
}
