import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from "./user.schema";
import mongoose from "mongoose";
export type SubscriptionDocument = Subscription & Document;

@Schema()
export class Subscription{
  @Prop()
  amount: number;

  @Prop()
  type: string;

  @Prop()
  network: string;

  @Prop()
  subPackage: string;

  @Prop()
  smartCard: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  user: User

  @Prop({default:"Pending"})
  status: string;

  @Prop()
  description: string;

  @Prop()
  subscriptionNumber: string;

  @Prop()
  transactionId: string;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
