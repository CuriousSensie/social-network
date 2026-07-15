import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { Model, Types } from 'mongoose';
import { UsersService } from '../users/users.service';
import { AccessStatus } from '../users/enums/access-status.enum';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentPlan } from './enums/payment-plan.enum';
import { PaymentStatus } from './enums/payment-status.enum';
import { Payment, PaymentDocument } from './schemas/payment.schema';

@Injectable()
export class PaymentsService {
  private readonly currency = 'USD';
  private readonly mockCheckoutBaseUrl = 'https://stripe-mock.local/checkout';

  constructor(
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<PaymentDocument>,
    private readonly usersService: UsersService,
  ) {}

  async getPaywallStatus(userId: string) {
    const user = await this.usersService.findById(userId);

    const latestPayment = await this.paymentModel
      .findOne({ userId: new Types.ObjectId(userId) as any })
      .sort({ createdAt: -1 })
      .exec();

    return {
      userId,
      accessStatus: user.accessStatus,
      isLocked: user.accessStatus !== AccessStatus.PAID,
      latestPayment: latestPayment ? latestPayment : null,
    };
  }

  async requirePaidAccess(userId: string): Promise<void> {
    const user = await this.usersService.findById(userId);

    if (user.accessStatus !== AccessStatus.PAID) {
      throw new ForbiddenException(
        'Feed is behind a paywall. Complete checkout to unlock it.',
      );
    }
  }

  async createCheckoutSession(createPaymentDto: CreatePaymentDto) {
    const user = await this.usersService.findById(createPaymentDto.userId);

    if (user.accessStatus === AccessStatus.PAID) {
      throw new BadRequestException('This account already has paid access');
    }

    const planDetails = this.getPlanDetails(createPaymentDto.plan);
    const checkoutSessionId = `cs_${randomUUID().replace(/-/g, '')}`;

    const payment = await this.paymentModel.create({
      userId: new Types.ObjectId(createPaymentDto.userId) as any,
      amount: planDetails.amount,
      currency: (createPaymentDto.currency ?? this.currency).toUpperCase(),
      plan: createPaymentDto.plan,
      status: PaymentStatus.PENDING,
      provider: 'stripe-mock',
      checkoutSessionId,
      completedAt: null,
    });

    return {
      payment,
      checkoutSession: {
        id: checkoutSessionId,
        provider: 'stripe-mock',
        url: `${this.mockCheckoutBaseUrl}/${checkoutSessionId}`,
        mode: planDetails.mode,
        amount: planDetails.amount,
        currency: payment.currency,
        plan: payment.plan,
      },
    };
  }

  async confirmCheckout(userId: string, paymentId: string) {
    const payment = await this.paymentModel.findById(paymentId).exec();

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${paymentId} not found`);
    }

    if (payment.userId.toString() !== userId) {
      throw new ForbiddenException(
        'This payment does not belong to the current user',
      );
    }

    if (payment.status === PaymentStatus.COMPLETED) {
      return payment;
    }

    payment.status = PaymentStatus.COMPLETED;
    payment.completedAt = new Date();
    await payment.save();

    await this.usersService.updateAccessStatus(userId, AccessStatus.PAID);

    return payment;
  }

  async getPaymentHistory(userId: string) {
    const payments = await this.paymentModel
      .find({ userId: new Types.ObjectId(userId) as any })
      .sort({ createdAt: -1 })
      .exec();

    return payments;
  }

  private getPlanDetails(plan: PaymentPlan) {
    const plans = {
      [PaymentPlan.MONTHLY]: { amount: 1499, mode: 'subscription' },
      [PaymentPlan.YEARLY]: { amount: 12999, mode: 'subscription' },
      [PaymentPlan.ONE_TIME]: { amount: 3999, mode: 'payment' },
    } as const;

    return plans[plan];
  }
}
