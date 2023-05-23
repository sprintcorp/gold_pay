import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
export type PaymentListDocument = PaymentList & Document;

@Schema()
export class PaymentList{
  @Prop()
  amount: number;

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
