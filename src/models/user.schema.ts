import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
export type UserDocument = User & Document;
import {Helper} from "../utils/helper";
import { IsEmail, IsEmpty, IsNotEmpty, MaxLength, MinLength } from "class-validator";


@Schema()
export class User {

    @Prop()
    @MaxLength(50)
    @MinLength(0)
    firstname: string;

    @Prop()
    @MaxLength(50)
    @MinLength(0)
    lastname: string;

    @Prop({required:true, unique:true, lowercase:true})
    @IsEmail()
    email: string;

    @Prop()
    @IsNotEmpty()
    @MinLength(6)
    password: string

    @Prop({length:8, default: Helper.uniqueRandomNumber(8, )})
    user_referral_code: string

    @Prop({length:8})
    referral_code: string

    @Prop({length:6, default: Math.floor(100000 + Math.random() * 900000)})
    otp: number

    @Prop({length:6, default: Math.floor(100000 + Math.random() * 900000)})
    login_pin: number

    @Prop({length:6})
    transaction_pin: number

    @Prop({default:false})
    active: boolean

    @Prop({default: Helper.addTime(15) })
    expiryDate: Date

    @Prop({default: Date.now() })
    createdDate: Date
}
export const UserSchema = SchemaFactory.createForClass(User)
