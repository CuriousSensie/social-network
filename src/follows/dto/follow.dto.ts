import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateDeleteFollowDto {
  @IsMongoId()
  @IsNotEmpty()
  followerId!: string;

  @IsMongoId()
  @IsNotEmpty()
  followingId!: string;
}

export class CreateFollowDto extends CreateDeleteFollowDto {}
export class DeleteFollowDto extends CreateDeleteFollowDto {}
