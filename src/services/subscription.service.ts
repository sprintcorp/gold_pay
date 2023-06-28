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
    // return subscription;

    // console.log(request.user);

    if(parseFloat(request.user.balance) < parseFloat(subscription.result)){
      throw new HttpException('You have insufficient balance, please deposit to continue this action', HttpStatus.FORBIDDEN)
    }

    const url = new URLSwitch(subscription.type, subscription.network, subscription.amount, 
      subscription.subscriptionNumber, subscription.subPackage ?? '', subscription.smartCard ?? '');

    const actionURL = url.getSubscriptionURL();

    console.log(actionURL);
    try{
    const response = await this.httpService.axiosRef.get(actionURL);
   

      if(response.data.status == 'ORDER_RECEIVED'){
    
        subscription.transactionId = response.data.orderid;

        const newBalance = parseFloat(request.user.balance) - parseFloat(subscription.result);

        const debitBalance = parseFloat(request.user.debit) + parseFloat(subscription.result);

      
        delete subscription['result']

        await new this.subscriptionModel(subscription).save();

        request.user.balance = newBalance;
        request.user.debit = debitBalance;
        request.user.username = request.user.username ? request.user.username :
        'user_'+request.user.firstname+request.user.lastname;

        await request.user.save();

        return response.data;
      }
    throw new HttpException(response.data.status, 400)
    }catch(error){
      throw new HttpException(error, HttpStatus.FORBIDDEN)
    }
  }


  async getSubscriptions(request){
    const subscription = await this.subscriptionModel.find({user:request.user._id});
    return subscription;
  }
  
}
