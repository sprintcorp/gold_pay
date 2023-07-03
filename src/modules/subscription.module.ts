
import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
import { SubscriptionController } from 'src/controllers/subscription.controller';
// import { Subscription, SubscriptionSchema } from 'src/models/subscription.schema';
import { SubscriptionService } from 'src/services/subscription.service';

@Module({
  imports:[
    
  ],
  providers: [SubscriptionService],
  controllers: [SubscriptionController],
})
export class SubscriptionModule {
  
}
