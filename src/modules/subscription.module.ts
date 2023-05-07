import { Module } from '@nestjs/common';
import { SubscriptionController } from 'src/controllers/subscription.controller';
import { SubscriptionService } from 'src/services/subscription.service';

@Module({
  providers: [SubscriptionService],
  controllers: [SubscriptionController]
})
export class SubscriptionModule {
  
}
