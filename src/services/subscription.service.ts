import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { SubscriptionDocument, Subscription } from "../models/subscription.schema";
import { Model } from "mongoose";
import { SubscriptionDto } from "../dto/subscription.dto";
import { HttpService } from "@nestjs/axios";
import { URLSwitch } from "src/utils/URLSwitch";

@Injectable()
export class SubscriptionService{
  constructor(@InjectModel(Subscription.name) private subscriptionModel: Model<SubscriptionDocument>,
              private readonly httpService: HttpService) {
  }

  async serviceSubscription(subscription: SubscriptionDto, request){

    if(request.user.transaction_pin != subscription.transactionPin){
      throw new HttpException('Invalid transaction pin', HttpStatus.FORBIDDEN)
    }
    
    if(request.user.balance== 0 && request.user.balance < subscription.amount){
      throw new HttpException('You have insufficient balance, please deposit to continue this action', HttpStatus.FORBIDDEN)
    }

    const url = new URLSwitch(subscription.type, subscription.network, subscription.amount, 
      subscription.subscriptionNumber);

    const actionURL = url.getSubscriptionURL();

    const response = await this.httpService.axiosRef.get(actionURL);

    console.log(response.data);
    return response.data;


  }


  
}
