import { IsMongoId, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePostDto {
  @IsMongoId()
  @IsNotEmpty()
  authorId!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(80, { message: 'Post title cannot exceed 80 characters' })
  title!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500, { message: 'Post content cannot exceed 500 characters' })
  content!: string;
}
