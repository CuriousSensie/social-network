import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CreateUserDto {
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail()
  @MaxLength(254)
  email!: string;

  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @Matches(/^[a-z0-9._]+$/, {
    message:
      'username may contain only lowercase letters, numbers, periods, and underscores',
  })
  username!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  passwordHash!: string;

  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  displayName!: string;

  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MaxLength(500)
  bio = '';

  @ValidateIf(
    (_object, value: unknown) =>
      value !== undefined && value !== null && value !== '',
  )
  @IsUrl({
    protocols: ['http', 'https'],
    require_protocol: true,
  })
  avatarUrl?: string | null;
}
