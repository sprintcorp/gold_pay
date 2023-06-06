import { User } from "../models/user.schema";
import { IsNotEmpty, IsOptional, MaxLength, MinLength } from "class-validator";

export class SubscriptionDto {
  @MaxLength(50)
  @MinLength(2)
  @IsOptional()
  amount: number;

  @MaxLength(50)
  @MinLength(2)
  result: string;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  network: string;

  @IsOptional()
  subPackage: string;

  @IsOptional()
  smartCard: string;

  user: User;

  @IsOptional()
  description: string;

  @IsNotEmpty()
  subscriptionNumber: string;

  @IsNotEmpty()
  @MaxLength(6)
  @MinLength(6)
  transactionPin: string;

  transactionId:string;
}
