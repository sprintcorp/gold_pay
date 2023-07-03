import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('subscription')
export class SubscriptionConsumer {

    @Process('process')
    handleTranscode() {
      console.log('Start audio compress into mp3...');
    //   console.log(job.data);
      console.log('completed!!');
    }

}