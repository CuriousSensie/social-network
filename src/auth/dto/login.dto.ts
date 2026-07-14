import { Transform } from 'class-transformer';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @MaxLength(254)
  emailOrUsername!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;
}
