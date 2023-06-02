import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { SubscriptionDocument, Subscription } from "../models/subscription.schema";
import { Model } from "mongoose";
import { SubscriptionDto } from "../dto/subscription.dto";
import { HttpService } from "@nestjs/axios";
import { URLSwitch } from "src/utils/URLSwitch";
import { User, UserDocument } from "src/models/user.schema";
import { Helper } from "src/utils/helper";

@Injectable()
export class SubscriptionService{
  constructor(@InjectModel(Subscription.name) private subscriptionModel: Model<SubscriptionDocument>,
              private readonly httpService: HttpService, @InjectModel(User.name)  private userModel: Model<UserDocument>) {
  }

  async serviceSubscription(subscription: SubscriptionDto, request){

    if(request.user.transaction_pin != subscription.transactionPin){
      throw new HttpException('Invalid transaction pin', HttpStatus.FORBIDDEN)
    }

    if(request.user.balance== 0 || request.user.balance < subscription.amount){
      throw new HttpException('You have insufficient balance, please deposit to continue this action', HttpStatus.FORBIDDEN)
    }

    subscription.user = request.user._id;
    

    const url = new URLSwitch(subscription.type, subscription.network, subscription.amount, 
      subscription.subscriptionNumber, subscription.subPackage ?? '', subscription.smartCard ?? '');

    const actionURL = url.getSubscriptionURL();

    // const response = await this.httpService.axiosRef.get(actionURL);

    // subscription.transactionId = response.data.orderid;
    subscription.transactionId = Helper.uniqueRandomNumber(10);

    const newBalance = request.user.balance - subscription.result;

    const debitBalance = request.user.debit + subscription.result;

    delete subscription['result']

    await new this.subscriptionModel(subscription).save();

    const user = await this.userModel.findByIdAndUpdate(request.user._id,
       {balance:newBalance, debit:debitBalance}, { new: true });
    
    return user;


  }

  async getSubscriptions(request){
    const subscription = await this.subscriptionModel.find({user:request.user._id});
    return subscription;
  }


  
}
