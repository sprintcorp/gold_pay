import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PaymentDTO } from "src/dto/payment.dto";
import { PaymentListDTO } from "src/dto/paymentList.dto";
import { PaymentHistory, PaymentHistoryDocument } from "src/models/paymentHistory.schema";
import { PaymentList, PaymentListDocument } from "src/models/paymentList.schema";
import { User, UserDocument } from "src/models/user.schema";
import { populateValue } from "src/utils/helper";

@Injectable()
export class PaymentService{
  constructor(@InjectModel(PaymentHistory.name) private paymentHistoryModel: Model<PaymentHistoryDocument>,
              @InjectModel(PaymentList.name)  private paymentListModel: Model<PaymentListDocument>,
              @InjectModel(User.name)  private userModel: Model<UserDocument>) {
  }

  async createPaymentList(paymentList: PaymentListDTO){
      try{
        const data =  await new this.paymentListModel(paymentList).save();
        return data;
      }catch(e){
        throw e;
      }
  }

  async updatePaymentList(paymentList: PaymentListDTO, id){
    try{
        const data =  await this.paymentListModel.findByIdAndUpdate(id, paymentList, {new:true});
        return data;
      }catch(e){
        throw e;
      }   
  }

  async paymentList(id, role){
    try{
      if(role == 'admin'){
        return await this.paymentListModel.findOne({_id:id});
      }
        return await this.paymentListModel.findOne({_id:id});
    }catch(e){
        throw e;
    }   
  }

  async getPaymentList():Promise<any>{
    return await this.paymentListModel.find();
  }

  async deletePaymentList(id){
    try{
        await this.paymentListModel.findByIdAndRemove(id);
        return "Payment list deleted successfully";
      }catch(e){
        throw e;
      }   
  }
  

  async depositRequest(payment: PaymentDTO, request){
    try{
        // if(request.user.accountNumber && request.user.bankName && request.user.accountName){
            payment.user = request.user._id;
            const data =  await new this.paymentHistoryModel(payment).save();
            return data;
        // }
        // throw new HttpException('Pls fill in your account information to perform deposit action'
        // , HttpStatus.PRECONDITION_REQUIRED)
      }catch(e){
        throw e;
      }
  }

  async userPaymentRequest(){
    return await this.paymentHistoryModel.find().populate('user', populateValue);
  }

  async userPaymentRequestDetails(id){
    return await this.paymentHistoryModel.findOne({_id:id}).populate('user', populateValue);
  }

  async withdrawRequest(payment, request){

    if(request.user.login_pin != payment.login_pin){
        throw new HttpException('Invalid transaction pin', HttpStatus.FORBIDDEN)
    }
  
    if(request.user.balance== 0 || request.user.balance < payment.result){
        throw new HttpException('You have insufficient balance, please deposit to continue this action', HttpStatus.FORBIDDEN)
    }


    const pendingWithdraw = await this.paymentHistoryModel.
    aggregate([
        { $match: { user: request.user._id , type: 'withdraw'} },
        { $group: { _id: null, result: { $sum: "$result" } } }
    ]);

    console.log(pendingWithdraw[0]);

    if(pendingWithdraw.length > 0){
        const availableBalance = pendingWithdraw[0].result + parseInt(payment.result);
        const possibleAmount = request.user.balance - pendingWithdraw[0].result;

        if(availableBalance > request.user.balance){
            throw new HttpException(`You have insufficient account balance because of pending withdraw, your possible withdraw amount is ${possibleAmount}`, HttpStatus.FORBIDDEN)
        }
    }

    try{
        payment.user = request.user._id;
        payment.status = 'Awaiting-Approval' 
        return await new this.paymentHistoryModel(payment).save()
    }catch(e){
        throw e;
    }

  }

  async paymentHistory(request){
    return await this.paymentHistoryModel.find({user:request.user}).populate('paymentList');
  }

  async confrimPayment(id): Promise<any>{
    try{
        const payment = await this.paymentHistoryModel.findOne({_id:id,status:'Pending'});

        if(!payment){
            throw new HttpException('No pending action is required from you for this payment', HttpStatus.NOT_FOUND)
        }
        return await this.paymentHistoryModel.findByIdAndUpdate(id,{status:'Awaiting-Approval'},{new:true});
    }catch(e){
        throw e;
    }
  }

  async adminConfirmPayment(id){
    try{
        const payment = await this.paymentHistoryModel.findOne({_id:id,status:'Awaiting-Approval'});

        if(!payment){
            throw new HttpException('No pending action is required from you for this payment', HttpStatus.NOT_FOUND)
        }
        const paymentApproved = await this.paymentHistoryModel.findByIdAndUpdate(id,{status:'Confirmed','updatedAt':Date.now()}
        ,{new:true});

        const user = await this.userModel.findById(paymentApproved.user);

        let balance = user.balance + paymentApproved.result;
        let blockchainBalance = user.blockchain_balance + paymentApproved.result;

        if(payment.type == 'withdraw'){
            balance = user.balance - paymentApproved.result;
            blockchainBalance = user.blockchain_balance - paymentApproved.result;
        }

        await this.userModel.findByIdAndUpdate(paymentApproved.user,
            {balance:balance, blockchain_balance:blockchainBalance}, { new: true });


        return paymentApproved;


    }catch(e){
        throw e;
    }
  }


}