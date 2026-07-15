import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaymentPlan } from '../enums/payment-plan.enum';

export class CreatePaymentDto {
  @IsMongoId()
  @IsNotEmpty()
  userId!: string;

  @IsEnum(PaymentPlan)
  @IsNotEmpty()
  plan!: PaymentPlan;

  @IsOptional()
  @IsString()
  currency?: string;
}
