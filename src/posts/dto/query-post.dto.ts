import { IsMongoId, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class QueryPostsDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  search?: string;

  @IsMongoId()
  @IsString()
  authorId?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
