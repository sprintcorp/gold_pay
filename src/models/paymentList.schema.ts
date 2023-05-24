import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
export type PaymentListDocument = PaymentList & Document;

@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class PaymentList{
  @Prop()
  currency: string;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  accountNumber: number;

  @Prop()
  accountName: string;

  @Prop()
  accountType: string;

  @Prop()
  bankName: string;
  
}

export const PaymentListSchema = SchemaFactory.createForClass(PaymentList);

PaymentListSchema.virtual('paymentList', {
  ref: 'PaymentHistory',
  localField: '_id',
  foreignField: 'paymentList',
  justOne: false
});
