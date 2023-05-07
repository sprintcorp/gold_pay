import { User } from "../models/user.schema";
import { IsNotEmpty, IsOptional, MaxLength, MinLength } from "class-validator";

export class SubscriptionDto {
  @MaxLength(50)
  @MinLength(2)
  amount: number;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  network: string;

  @IsNotEmpty()
  user: User

  @IsOptional()
  description: string;

  @IsNotEmpty()
  subscriptionNumber: string;

  @IsNotEmpty()
  @MaxLength(6)
  @MinLength(6)
  transactionPin: string;
}
