import { IsEnum, IsNotEmpty } from 'class-validator';
import { PostStatus } from '../enums/post-status.enum';

export class UpdatePostStatusDto {
  @IsEnum(PostStatus)
  @IsNotEmpty()
  status!: PostStatus;
}
