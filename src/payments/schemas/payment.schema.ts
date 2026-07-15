import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { PaymentStatus } from '../enums/payment-status.enum';
import { PaymentPlan } from '../enums/payment-plan.enum';

export type PaymentDocument = HydratedDocument<Payment>;

@Schema({
  timestamps: true,
  versionKey: false,
  collection: 'payments',
})
export class Payment {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId!: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  amount!: number;

  @Prop({ required: true, default: 'USD' })
  currency!: string;

  @Prop({
    type: String,
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status!: PaymentStatus;

  @Prop({
    type: String,
    enum: PaymentPlan,
    default: PaymentPlan.MONTHLY,
  })
  plan!: PaymentPlan;

  @Prop({ required: true, default: 'stripe-mock' })
  provider!: string;

  @Prop({ required: true, unique: true, index: true })
  checkoutSessionId!: string;

  @Prop({ type: Date, default: null })
  completedAt!: Date | null;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
