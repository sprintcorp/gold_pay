import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { SubscriptionDocument, Subscription } from "../models/subscription.schema";
import { Model } from "mongoose";
import { SubscriptionDto } from "../dto/subscription.dto";
import { HttpService } from "@nestjs/axios";
import { URLSwitch } from "src/utils/URLSwitch";
import { User, UserDocument } from "src/models/user.schema";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class SubscriptionService{
  
  private readonly logger = new Logger(SubscriptionService.name);

  constructor(@InjectModel(Subscription.name) private subscriptionModel: Model<SubscriptionDocument>,
  private mailService: MailerService, private readonly httpService: HttpService,
  @InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async serviceSubscription(subscription: SubscriptionDto, request){
    
    if(request.user.login_pin != subscription.loginPin){
      throw new HttpException('Invalid pin', HttpStatus.FORBIDDEN)
    }
    // return subscription;

    // console.log(request.user);

    if(parseFloat(request.user.balance) < parseFloat(subscription.result)){
      throw new HttpException('You have insufficient balance, please deposit to continue this action', HttpStatus.FORBIDDEN)
    }

    if(subscription.type == 'electricity'){
      const meterUrl = `https://www.nellobytesystems.com/APIVerifyElectricityV1.asp?UserID=${process.env.CONNECT_USER_ID}&APIKey=${process.env.CONNECT_API_KEY}&ElectricCompany=${subscription.network}&MeterNo=${subscription.smartCard}&MeterType=${subscription.subPackage}`;
      
      const meterVerification = await this.httpService.axiosRef.get(meterUrl);
      console.log(meterVerification.data);
      if(meterVerification.data.customer_name.length < 0){
        throw new HttpException('Invalid meter number', 400);
      }
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
        // request.user.balance = 600;
        request.user.debit = debitBalance;
        request.user.username = request.user.username ? request.user.username :
        'user_'+request.user.firstname+request.user.lastname;

        setTimeout(async()=>{
          await this.subscriptionAction(subscription.transactionId, subscription.type, request);
        }, 10000)

        return response.data;
      }
    throw new HttpException(response.data.status, 400)
    }catch(error){
      // request.user.balance = 600;
      // setTimeout(async()=>{
      //   await this.subscriptionAction(6496730644, subscription.type, request);
      // }, 10000)
      throw new HttpException(error, HttpStatus.FORBIDDEN)
    }
  }

  // @Cron('*/2 * * * *')
  // @Cron('* * * * *')
  // async handleCron() {
  //   await this.subscriptionAction();

  //   this.logger.debug('Called when the current second is 60');

  //   await this.subscriptionQueue.add({file: 'audio.mp3'});
  // }

  data: {
    date: '3rd-Jul-2023',
    orderid: '6497511876',
    statuscode: '200',
    status: 'ORDER_COMPLETED',
    remark: 'Success',
    ordertype: 'IBADAN PREPAID',
    meterno: '22160279711',
    metertoken: 'Token/PIN: 4834-6143-0516-4356-5617',
    amountcharged: '99.5',
    walletbalance: '17.87927'
  }

  async subscriptionAction(transactionId: any, type: string, request)
  {
    
    const verifyUrl = `https://www.nellobytesystems.com/APIQueryV1.0.asp?UserID=${process.env.CONNECT_USER_ID}&APIKey=${process.env.CONNECT_API_KEY}&OrderID=${transactionId}`;     
    const verifyTransation = await this.httpService.axiosRef.get(verifyUrl);

    

    if(type == 'electricity' && verifyTransation.data.status == 'ORDER_COMPLETED'){
      await this.mailService.sendMail({
        to:request.user.email,
        from:"no-reply@goldpay.com",
        subject: 'Electricity Token',
        template:'meter-token',
        context: {
          data:verifyTransation.data.metertoken
        }
      });
    }
    // console.log(request.user);

    if(verifyTransation.data.status == 'ORDER_COMPLETED'){
      await request.user.save();
    }
    // console.log(verifyTransation.data);
  }


  async getSubscriptions(request){
    const subscription = await this.subscriptionModel.find({user:request.user._id});
    return subscription;
  }
  
}
