import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // GET PAYWALL STATUS: GET /payments/paywall
  @Get('paywall')
  getPaywallStatus(@GetUser('userId') userId: string) {
    return this.paymentsService.getPaywallStatus(userId);
  }

  // CREATE PAYMENT: POST /payments/checkout
  @Post('checkout')
  @HttpCode(HttpStatus.CREATED)
  createCheckoutSession(
    @GetUser('userId') userId: string,
    @Body() createPaymentDto: CreatePaymentDto,
  ) {
    createPaymentDto.userId = userId;
    return this.paymentsService.createCheckoutSession(createPaymentDto);
  }

  // CONFIRM PAYMENT: POST /payments/paymentId/confirm
  @Post(':paymentId/confirm')
  confirmCheckout(
    @GetUser('userId') userId: string,
    @Param('paymentId') paymentId: string,
  ) {
    return this.paymentsService.confirmCheckout(userId, paymentId);
  }

  // GET PAYMENT HISTORY: GET /payments/history
  @Get('history')
  getPaymentHistory(@GetUser('userId') userId: string) {
    return this.paymentsService.getPaymentHistory(userId);
  }
}
