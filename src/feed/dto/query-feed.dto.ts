import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class QueryFeedDto extends PaginationQueryDto {
  @IsMongoId()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  sortBy: string = 'createdAt';

  @IsString()
  sortOrder: 'asc' | 'desc' = 'desc';
}
