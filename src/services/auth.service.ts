import { Injectable, HttpException, HttpStatus, Res } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "../models/user.schema";
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { OnEvent } from "@nestjs/event-emitter";

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {
  }

  @OnEvent('verify_mail')
  async signup(user: User, @Res() response): Promise<any> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(user.password, salt);
    const reqBody = {
      referral_code: user.referral_code,
      email: user.email,
      password: hash
    }
    // try{
    const newUser = new this.userModel(reqBody);
    return newUser.save()
    // }catch (e) {
    //   console.log('hellooooo '+ e.getMessage());
    // }
  }

  async signin(user: User, jwt: JwtService): Promise<any> {
    const foundUser = await this.userModel.findOne({ email: user.email }).exec();
    if (foundUser) {
      const { password } = foundUser;
      if (await bcrypt.compare(user.password, password)) {
        const payload = { email: user.email };
        return {
          token: jwt.sign(payload),
        };
      }
      return new HttpException('Incorrect username or password', HttpStatus.UNAUTHORIZED)
    }
    return new HttpException('Incorrect username or password', HttpStatus.UNAUTHORIZED)
  }

  async getOne(email): Promise<User> {
    return await this.userModel.findOne({ email }).exec();
  }

}
