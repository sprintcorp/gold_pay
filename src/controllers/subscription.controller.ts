import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { SubscriptionService } from "../services/subscription.service";
import { MailerService } from "@nestjs-modules/mailer";
import { SubscriptionDto } from "../dto/subscription.dto";
import { AuthGuard } from "../guards/auth.guard";
import { response } from "express";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";


@Controller('/api/v1/')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService, private mailService: MailerService)
   {

   }

  @UseGuards(AuthGuard)
  @Post('/user/subscription')
  async subscribeToService(@Res() response, @Req() request, @Body() subscription: SubscriptionDto){
    const data = await this.subscriptionService.serviceSubscription(subscription, request)
    return response.status(200).json(data);
  }

  @UseGuards(AuthGuard)
  @Get('user/subscriptions')
  async getUserSubscriptions(@Res() response, @Req() request){
    const data = await this.subscriptionService.getSubscriptions(request);
    return response.status(200).json(data);
  }

  @Get("/user/subscription-webhook")
  async subscriptionWebhook (@Res() response, @Req() request) {

    await this.mailService.sendMail({
      to:'sprintcorp7@gmail.com',
      from:"no-reply@goldpay.com",
      subject: 'Account verification',
      template:'hook',
      context: {
        data:response
      }
    });
   return "sent";
 }
}
