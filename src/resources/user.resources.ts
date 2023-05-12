import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../models/user.schema";
import  { Model } from "mongoose";
import { UserEntity } from "src/transformers/auth.response";
import { AuthDto } from "src/dto/auth.dto";

// @Injectable()
export class UserResources{
   
    response(user: UserEntity){
        return {
            'id': user._id,
            'firstname': user.firstname,
            'lastname': user.lastname,
            'balance': user.balance,
            'email': user.email,
            'login_pin': user.login_pin,
            'address': user.address,
            'otp': user.otp,
            'user_referral_code': user.user_referral_code,
        }
    }
}