import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  UploadedFiles,
  Put,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor
} from "@nestjs/common";
import { User } from "../models/user.schema";
import { AuthService } from "../services/auth.service";
import { JwtService } from '@nestjs/jwt'
import { MailerService } from "@nestjs-modules/mailer";
import { EventEmitter2 } from "@nestjs/event-emitter";
import {MailEvent} from "../events/mail.event";
import { AuthDto } from "../dto/auth.dto";
import { AuthGuard } from "../guards/auth.guard";
import { UserDto } from "../dto/user.dto";
import { TokenDto } from "src/dto/token.dto";
import { UserEntity } from "src/transformers/auth.response";
import { UserInterface } from "src/interfaces/user.interface";
import { CustomInterceptors } from "src/interceptors/custom.interceptor";
import { UserResources } from "src/resources/user.resources";


@Controller('/api/v1/')
export class AuthController {
  
  constructor(private readonly authService: AuthService,
              private jwtService: JwtService,
              private mailService: MailerService,
              private readonly userResources: UserResources,
              private eventEmitter: EventEmitter2
              // private eventEmitter: EventEmitterModule
  ) {
  }

  @Post('/auth/signup')
  async Signup(@Res() response, @Body() user: AuthDto):Promise<any> {

    const newUser = await this.authService.signup(user, response);

    const otp = newUser.otp;
    
    await this.mailService.sendMail({
      to:user.email,
      from:"no-reply@goldpay.com",
      subject: 'Account verification',
      template:'registration-email',
      context: {
        data:otp
      }
    });

    const userProfile = this.userResources.response(newUser);

    return response.status(HttpStatus.CREATED).json({
      userProfile
    });
  }

  @Post('/auth/signin')
  async SignIn(@Res() response, @Body() request){
    const data = await this.authService.signin(request, this.jwtService);
    return response.status(data.status).json({'token':data.token, 'user':data.user})
  }

  @Post('/auth/verify')
  async VerifyUser(@Res() response, @Body() request) {
    const verify = await this.authService.activateAccount(request);
    return response.status(HttpStatus.OK).json(verify)
  }

  @Post('/auth/resend-otp')
  async sendVerificationOTP(@Res() response, @Body() request){
    const otp = await this.authService.sendVerificationOTP(request);
    await this.mailService.sendMail({
      to:request.email,
      from:"no-reply@goldpay.com",
      subject: 'Account verification',
      template:'registration-email',
      context: {
        data:otp
      }
    });
    return response.status(HttpStatus.OK).json({'message': 'Account verification OTP successful sent to your email'})
  }

  @Post('/auth/password-token')
  async sendPasswordOTP(@Res() response, @Body() request){
    const otp = await this.authService.sendPasswordOTP(request);
    await this.mailService.sendMail({
      to:request.email,
      from:"no-reply@goldpay.com",
      subject: 'Reset Password OTP',
      template:'reset-password-email',
      context: {
        data:otp
      }
    });
    return response.status(HttpStatus.OK).json({'message': 'OTP successful sent to your email'})
  }

  @Post('/auth/password-reset')
  async ResetPassword(@Res() response, @Body() request) {
    const data = await this.authService.resetPassword(request);
    return response.status(data.status).json({'data':data.response});
  }

  @Post('/auth/login-pin')
  async PinLogin(@Res() response, @Body() request) {
    const data = await this.authService.pinLogin(request, this.jwtService);
    return response.status(data.status).json({'data':data.response});
  }

  @UseGuards(AuthGuard)
  @Get('/user/profile')
  async GetUserProfile(@Res() response, @Req() request): Promise<User>{
    const userData = await this.authService.getUserAccountBalance(request);
    const userProfile = this.userResources.response(userData)
    return response.status(200).json(userProfile)
  }

  @UseGuards(AuthGuard)
  @Post('/user/information')
  async GetUserData(@Res() response, @Body() request): Promise<User>{
    const userData = await this.authService.getUserByEmailUsername(request.username);
    const userProfile = this.userResources.response(userData)
    return response.status(200).json(userProfile)
  }


  @UseGuards(AuthGuard)
  @Put('/user/update-profile')
  async UpdateProfile(@Res() response, @Req() request, @Body() user: UserDto){
    const data = await this.authService.updateUser(user, request);
    const userProfile = this.userResources.response(data.response);
    return response.status(data.status).json(userProfile);
  }

  @UseGuards(AuthGuard)
  @Post('/user/token-transfer')
  async TransferToken(@Res() response, @Req() request, @Body() user: TokenDto){
    const data = await this.authService.transferToken(user, request);
    return response.status(data.status).json(data.response)
  }
}
