import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { SubscriptionConsumer } from 'src/consumers/subscription.consumer';
// import { MongooseModule } from '@nestjs/mongoose';
import { SubscriptionController } from 'src/controllers/subscription.controller';
// import { Subscription, SubscriptionSchema } from 'src/models/subscription.schema';
import { SubscriptionService } from 'src/services/subscription.service';

@Module({
  imports:[
    // BullModule.forRootAsync({
    //   useFactory: () => ({
    //     redis: {
    //       host: 'localhost',
    //       port: 6379,
    //     },
    //   }),
    // }),

    BullModule.registerQueueAsync(
      {
        name: 'subscription',
      },
    ),
  ],
  providers: [SubscriptionService],
  controllers: [SubscriptionController],
})
export class SubscriptionModule {
  
}
