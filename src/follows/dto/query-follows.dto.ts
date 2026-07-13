import { IsMongoId, IsNotEmpty } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class QueryFollowersDto extends PaginationQueryDto {
  @IsMongoId()
  @IsNotEmpty()
  followingId!: string;
}

export class QueryFollowingsDto extends PaginationQueryDto {
  @IsMongoId()
  @IsNotEmpty()
  followerId!: string;
}
