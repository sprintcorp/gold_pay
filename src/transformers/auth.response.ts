import { Exclude } from "class-transformer";
import { ObjectId, Document} from "mongoose";

export interface UserEntity extends Document{

  readonly _id: ObjectId;
  readonly firstname: string;
  readonly lastname: string;
  readonly username: string;
  readonly email: string;
  readonly password: string;
  readonly user_referral_code: string;
  readonly referral_code: string;
  readonly otp: number;
  readonly balance: number;
  readonly debit: number;
  readonly address: string
  readonly role: string
  readonly login_pin: number;
  readonly accountNumber: number;
  readonly accountName: string;
  readonly bankName: string;
  readonly transaction_pin: number;
  readonly active: boolean;
  readonly createdDate: Date;

}
