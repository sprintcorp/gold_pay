import { Injectable, HttpException, HttpStatus, Res } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "../models/user.schema";
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { OnEvent } from "@nestjs/event-emitter";
import { AuthDto } from "../dto/auth.dto";
import { Helper } from "../utils/helper";
import { AuthResponse } from "../transformers/auth.response";
import { response } from "express";

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {
  }

  @OnEvent('verify_mail')
  async signup(user: AuthDto, @Res() response): Promise<AuthResponse> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(user.password, salt);
    const reqBody = {
      referral_code: user.referral_code,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      password: hash
    }
    // try{
    const newUser = new this.userModel(reqBody);
    return newUser.save()
    // }catch (e) {
    //   console.log('hellooooo '+ e.getMessage());
    // }
  }

  async signin(user, jwt: JwtService): Promise<any> {

    let foundUser = await this.userModel.findOne({ email: user.email, active:true }).exec();
    if(user.username && user.username !== ''){
      foundUser = await this.userModel.findOne({ username: user.username, active:true }).exec();
    }

    if (foundUser) {
      const { password } = foundUser;
      if (await bcrypt.compare(user.password, password)) {
        const payload = { email: foundUser.email };
        return {
          'token': jwt.sign(payload),
          'user':foundUser,
          'status':HttpStatus.OK
        };
      }
      return {'response':"Incorrect username or password", 'status':HttpStatus.UNAUTHORIZED}
    }
    return {'response':"User does not exit within the system", 'status':HttpStatus.NOT_FOUND}
  }

  async activateAccount(user: User): Promise<any> {
    const foundUser = await this.userModel.findOne({ email: user.email, active:false }).exec();

    if(foundUser){
      if(foundUser.otp === user.otp){
        await this.userModel.findByIdAndUpdate(foundUser._id, {active:true}, { new: true });
        return "User activated successfully.";
      }else{
        return new HttpException('Invalid OTP', HttpStatus.UNAUTHORIZED)
      }
    }else{
      return new HttpException('User not found', HttpStatus.NOT_FOUND)
    }
  }

  async sendVerificationOTP(user: User): Promise<any>{
    let foundUser = await this.userModel.findOne({ email: user.email, active:false }).exec();

    console.log(foundUser)

    if(user.username && user.username !== ''){
      foundUser = await this.userModel.findOne({ username: user.username, active:false }).exec();
    }
    if(foundUser){
        const otp = Math.floor(100000 + Math.random() * 900000);
        await this.userModel.findByIdAndUpdate(foundUser._id, {otp:otp, expiryDate:Helper.addTime(15)}, { new: true });
        return otp;
    }else{
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }
  }

  async sendPasswordOTP(user: User): Promise<any>{
    let foundUser = await this.userModel.findOne({ email: user.email, active:true }).exec();
    console.log(foundUser);
    if(user.username && user.username !== ''){
      foundUser = await this.userModel.findOne({ username: user.username, active:true }).exec();
    }
    if(foundUser){
      const otp = Math.floor(100000 + Math.random() * 900000);
      await this.userModel.findByIdAndUpdate(foundUser._id, {otp:otp, expiryDate:Helper.addTime(15)}, { new: true });
      return otp;
    }else{
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }
  }

  async resetPassword(user): Promise<any>{
    let foundUser = await this.userModel.findOne({ email: user.email, otp:user.otp }).exec();

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(user.password, salt);

    if(foundUser){
      const otp = Math.floor(100000 + Math.random() * 900000);
      await this.userModel.findByIdAndUpdate(foundUser._id, {password:hash}, { new: true });
      return {'response':"Password reset successfully", 'status':HttpStatus.OK}
    }else{
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }
  }

  async pinLogin(user, jwt: JwtService): Promise<any> {
    let foundUser = await this.userModel.findOne({ email: user.email, login_pin: user.login_pin, active:true }).exec();

    if (foundUser) {
        const payload = { email: foundUser.email };
        return {
          'response': jwt.sign(payload),
          'status':HttpStatus.OK
        };
      }else {
      return { 'response': "Invalid user pin", 'status': HttpStatus.UNAUTHORIZED }
    }

    return {'response':"User does not exit within the system", 'status':HttpStatus.NOT_FOUND}
  }

  async updateUser(user, request): Promise<any>{
    if(user.hasOwnProperty('old_password')){
      if (!await bcrypt.compare(user.old_password, request.user.password)) {
        throw new HttpException('Old password is incorrect', HttpStatus.NOT_FOUND);
      }else if (user.password !== user.confirm_password ){
        throw new HttpException("Password must be same as confirm password", HttpStatus.NOT_FOUND)
      }else{
        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(user.password, salt);
      }
    }

    if((!user.old_password && user.hasOwnProperty('login_pin')) || (!user.old_password && user.hasOwnProperty('transaction_pin'))){
      if(!user.password || user.password === ''){
        throw new HttpException('Password is required for this action', HttpStatus.UNAUTHORIZED);
      }

      if (!await bcrypt.compare(user.password, request.user.password)) {
        throw new HttpException('Password is incorrect pls review password to complete this action', HttpStatus.UNAUTHORIZED);
      }

     delete user['password'];
    }

    const response = await this.userModel.findByIdAndUpdate(request.user._id, user, { new: true }).exec()
    return { 'response': response, 'status': HttpStatus.OK }
  }

  async getOne(email): Promise<User> {
    return await this.userModel.findOne({ email }).exec();
  }

}
