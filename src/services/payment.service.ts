import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PaymentDTO } from "src/dto/payment.dto";
import { PaymentListDTO } from "src/dto/paymentList.dto";
import { PaymentHistory, PaymentHistoryDocument } from "src/models/paymentHistory.schema";
import { PaymentList, PaymentListDocument } from "src/models/paymentList.schema";
import { User } from "src/models/user.schema";

@Injectable()
export class PaymentService{
  constructor(@InjectModel(PaymentHistory.name) private paymentHistoryModel: Model<PaymentHistoryDocument>,
              @InjectModel(PaymentList.name)  private paymentListModel: Model<PaymentListDocument>) {
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

  async paymentList(id){
    try{
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
        if(request.user.accountNumber && request.user.bankName && request.user.accountName){
            payment.user = request.user._id;
            const data =  await new this.paymentHistoryModel(payment).save();
            return data;
        }
        throw new HttpException('Pls fill in your account information to perform deposit action'
        , HttpStatus.PRECONDITION_REQUIRED)
      }catch(e){
        throw e;
      }
  }

  async withdrawRequest(){

  }

  async paymentHistory(){

  }



}