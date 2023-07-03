import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from "./user.schema";
import mongoose from "mongoose";
import { PaymentList } from "./paymentList.schema";
import { Type } from "class-transformer";
export type PaymentHistoryDocument = PaymentHistory & Document;

@Schema()
export class PaymentHistory{
  @Prop()
  amount: number;

  @Prop()
  result: number;

  @Prop()
  type: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  user: User

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "PaymentList" })
  @Type(() => PaymentList)
  paymentList: PaymentList

  @Prop({default:"Pending"})
  status: string;

  @Prop({default: Date.now()})
  createdDate: Date

  @Prop()
  updatedDate: Date
}

export const PaymentHistorySchema = SchemaFactory.createForClass(PaymentHistory);
