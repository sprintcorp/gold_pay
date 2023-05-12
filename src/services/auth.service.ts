import { Injectable, HttpException, HttpStatus, Res } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { User, UserDocument } from "../models/user.schema";
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { OnEvent } from "@nestjs/event-emitter";
import { AuthDto } from "../dto/auth.dto";
import { Helper } from "../utils/helper";
import { UserEntity } from "../transformers/auth.response";
import { response } from "express";
import { MailerService } from "@nestjs-modules/mailer";
import { UserInterface } from "src/interfaces/user.interface";
import { UserResources } from "src/resources/user.resources";

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserEntity>, 
  @InjectConnection() private readonly connection: mongoose.Connection, 
  private readonly userResources: UserResources
  ) {
  }

  @OnEvent('verify_mail')
  async signup(user: AuthDto, @Res() response):Promise<UserEntity>{
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(user.password, salt);

    const usernameExist = await this.userModel.findOne({username: user.username}).exec()

    if(usernameExist){
      throw new HttpException("Username already exist", 422);
    }

    const reqBody = {
      referral_code: user.referral_code,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      password: hash
    }
    // try{
    const newUser = new this.userModel(reqBody).save();
    return newUser;
    // }catch (e) {
    //   console.log('hellooooo '+ e.getMessage());
    // }
  }

  async signin(user, jwt: JwtService): Promise<any> {

    // let foundUser = await this.userModel.findOne({ email: user.email, active:true }).exec();
    // if(user.username && user.username !== ''){
    //   foundUser = await this.userModel.findOne({ username: user.username, active:true }).exec();
    // }

    const foundUser = await this.userModel.findOne({$and: [{$or:[{email:user.username}, {username: user.username}], active:true}]}).exec();

    if (foundUser) {
      const { password } = foundUser;
      if (await bcrypt.compare(user.password, password)) {
        const payload = { email: foundUser.email };
        return {
          'token': jwt.sign(payload),
          'user': this.userResources.response(foundUser),
          'status': HttpStatus.OK
        };
      }
      throw new HttpException("Incorrect username or password", HttpStatus.UNAUTHORIZED)
    }
    throw new HttpException("Account not verified or does not exit within the system", HttpStatus.NOT_FOUND)
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
    // let foundUser = await this.userModel.findOne({ email: user.email, active:false }).exec();

    

    // if(user.username && user.username !== ''){
    //   foundUser = await this.userModel.findOne({ username: user.username, active:false }).exec();
    // }

    const foundUser = await this.userModel.findOne({$and: [{$or:[{email:user.email}, {username: user.username}], active:true}]}).exec();

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


  async transferToken(user, request){
    if(request.user.transaction_pin != user.transactionPin){
      throw new HttpException('Invalid transaction pin', HttpStatus.FORBIDDEN)
    }

    // if(request.user.balance== 0 || request.user.balance < user.amount){
    //   throw new HttpException('You have insufficient balance, please deposit to continue this action', HttpStatus.FORBIDDEN)
    // }

    const receiver = await this.userModel.findOne({$or:[{email:user.user}, 
      {username: user.user}]}).exec();

      if(!receiver){
        throw new HttpException('User does not exist', HttpStatus.NOT_FOUND)
      }


    const session = await this.connection.startSession();
 
    session.startTransaction();

    try {

    
      const sender_balance = request.user.balance - parseInt(user.amount);

      const receiver_balance = receiver.balance + parseInt(user.amount);

      await this.userModel.findByIdAndUpdate(request.user._id,
        {balance: sender_balance},{ new: true }).exec()

      await this.userModel.findByIdAndUpdate(receiver._id,
        {balance: receiver_balance},{ new: true }).exec()

      await session.commitTransaction();
      
    } catch (error) {
      await session.abortTransaction();
      throw error;
    }
    session.endSession();
    return { 'response': `Token tranferred to ${user.user} successfully`, 'status': HttpStatus.OK };
  }

  async getOne(email): Promise<UserEntity> {
    return await this.userModel.findOne({ email }).exec();
  }

}
