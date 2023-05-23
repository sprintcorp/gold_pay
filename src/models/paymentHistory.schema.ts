import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from "./user.schema";
import mongoose from "mongoose";
export type PaymentHistoryDocument = PaymentHistory & Document;

@Schema()
export class PaymentHistory{
  @Prop()
  amount: number;

  @Prop()
  type: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  user: User

  @Prop({default:"Pending"})
  status: string;

  @Prop({default: Date.now()})
  createdDate: Date

  @Prop()
  updatedDate: Date
}

export const PaymentHistorySchema = SchemaFactory.createForClass(PaymentHistory);
