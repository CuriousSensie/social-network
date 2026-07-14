import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { AccessStatus } from '../enums/access-status.enum';
import { UserStatus } from '../enums/user-status.enum';
import { UserRole } from '../enums/user-role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  versionKey: false,
  collection: 'users',
})
export class User {
  _id!: Types.ObjectId;

  @Prop({
    required: true,
    trim: true,
    lowercase: true,
    maxlength: 254,
    unique: true,
  })
  email!: string;

  @Prop({
    required: true,
    trim: true,
    lowercase: true,
    minlength: 3,
    maxlength: 30,
    match: /^[a-z0-9._]+$/,
    unique: true,
  })
  username!: string;

  @Prop({
    required: true,
    select: false,
  })
  passwordHash!: string;

  @Prop({
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 80,
  })
  displayName!: string;

  @Prop({
    trim: true,
    maxlength: 500,
    default: '',
  })
  bio!: string;

  @Prop({
    trim: true,
    default: null,
  })
  avatarUrl!: string;

  @Prop({
    type: String,
    enum: UserRole,
    default: UserRole.USER,
  })
  role!: UserRole;

  @Prop({
    type: String,
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status!: UserStatus;

  @Prop({
    default: false,
  })
  emailVerified!: boolean;

  @Prop({
    type: String,
    enum: AccessStatus,
    default: AccessStatus.FREE,
  })
  accessStatus!: AccessStatus;

  @Prop({
    min: 0,
    default: 0,
  })
  followerCount!: number;

  @Prop({
    min: 0,
    default: 0,
  })
  followingCount!: number;

  @Prop({
    min: 0,
    default: 0,
  })
  postCount!: number;

  createdAt!: Date;
  updatedAt!: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
