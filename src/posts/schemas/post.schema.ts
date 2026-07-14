import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsMongoId, IsNotEmpty } from 'class-validator';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { PostStatus } from '../enums/post-status.enum';

export type PostDocument = HydratedDocument<Post>;

@Schema({
  timestamps: true,
  versionKey: false,
  collection: 'posts',
})
export class Post {
  @IsMongoId()
  @IsNotEmpty()
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  authorId!: MongooseSchema.Types.ObjectId;

  @Prop({
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 80,
  })
  title!: string;

  @Prop({
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 500,
  })
  content!: string;

  @Prop({
    type: String,
    enum: PostStatus,
    default: PostStatus.DRAFT,
  })
  status!: PostStatus;

  // To be added later
  // Likes, comments, media (images, files and videos), tags

  createdAt!: Date;
  updatedAt!: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
