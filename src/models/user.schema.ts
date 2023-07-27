import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
export type UserDocument = User & Document;
import {Helper} from "../utils/helper";
import { IsEmail, IsEmpty, IsNotEmpty, IsOptional, MaxLength, MinLength } from "class-validator";
import { Exclude } from "class-transformer";


@Schema()
export class User {
    
    @Prop()
    firstname: string;

    @Prop()
    lastname: string;

    @Prop({required:true, unique:true, lowercase:true})
    email: string;

    @Prop({default:'user'})
    role: string;

    @Prop({required:true, unique:true, lowercase:true})
    // @MaxLength(50)
    // @MinLength(0)
    username: string;

    @Prop()
    // @IsNotEmpty()
    // @MinLength(6)
    // @Exclude()
    password: string

    @Prop({length:8, default: Helper.uniqueRandomNumber(8)})
    user_referral_code: string

    @Prop({length:8, ref: "User"})
    // @MaxLength(8)
    // @MinLength(8)
    // @IsOptional()
    referral_code: string
    @Prop()
    address: string

    @Prop()
    private_key: string

    @Prop({length:6, default: Math.floor(100000 + Math.random() * 900000)})
    otp: number

    @Prop({length:6, default: Math.floor(100000 + Math.random() * 900000)})
    login_pin: string

    @Prop({length:6})
    transaction_pin: string

    @Prop({default:0})
    balance:number

    @Prop({default:0})
    blockchain_balance:number

    @Prop({default:0})
    debit:number

    @Prop()
    accountNumber:string

    @Prop()
    accountName:string

    @Prop()
    bankName:string

    @Prop({default:false})
    active: boolean

    @Prop({default: Helper.addTime(15) })
    expiryDate: Date

    @Prop({default: Date.now() })
    createdDate: Date

}

export const UserSchema = SchemaFactory.createForClass(User)

UserSchema.virtual('user', {
    ref: 'PaymentHistory',
    localField: '_id',
    foreignField: 'user',
    justOne: false
});
