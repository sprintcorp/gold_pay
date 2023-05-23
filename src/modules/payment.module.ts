import { Module } from '@nestjs/common';
import { PaymentController } from 'src/controllers/payment.controller';
import { PaymentService } from 'src/services/payment.service';

@Module({
  providers: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {
  
}
