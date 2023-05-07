import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { SubscriptionService } from "../services/subscription.service";
import { MailerService } from "@nestjs-modules/mailer";
import { SubscriptionDto } from "../dto/subscription.dto";
import { AuthGuard } from "../guards/auth.guard";

@Controller('/api/v1/')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService,
              private mailService: MailerService) {
  }

  @UseGuards(AuthGuard)
  @Post('/user/subscriptions')
  async subscribeToService(@Res() response, @Req() request, @Body() subscription: SubscriptionDto){
    const data = await this.subscriptionService.serviceSubscription(subscription, request)
    return response.status(200).json(data);
  }


  @Post("/user/subscription-webhook")
  async subscriptionWebhook (@Res() response, @Req() request) {

    await this.mailService.sendMail({
      to:'sprintcorp7@gmail.com',
      from:"no-reply@goldpay.com",
      subject: 'Account verification',
      template:'registration-email',
      context: {
        data:response
      }
    });
   return "sent";
 }
}