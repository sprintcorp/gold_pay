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
  UseGuards
} from "@nestjs/common";
import { User } from "../models/user.schema";
import { AuthService } from "../services/auth.service";
import { JwtService } from '@nestjs/jwt'
import { MailerService } from "@nestjs-modules/mailer";
// import { EventEmitterModule } from "@nestjs/event-emitter";
import {MailEvent} from "../events/mail.event";
import { AuthDto } from "../dto/auth.dto";
import { AuthGuard } from "../guards/auth.guard";
import { UserDto } from "../dto/user.dto";


@Controller('/api/v1/')
export class AuthController {
  constructor(private readonly authService: AuthService,
              private jwtService: JwtService,
              private mailService: MailerService,
              // private eventEmitter: EventEmitterModule
  ) {
  }

  @Post('/auth/signup')
  async Signup(@Res() response, @Body() user: AuthDto) {

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

    return response.status(HttpStatus.CREATED).json({
      newUser
    })
  }

  @Post('/auth/signin')
  async SignIn(@Res() response, @Body() request) {
    const data = await this.authService.signin(request, this.jwtService);
    return response.status(data.status).json({'data':data.response})
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
  async GetUserProfile(@Res() response, @Req() request){
    return response.status(200).json(request.user)
  }


  @UseGuards(AuthGuard)
  @Put('/user/update-profile')
  async UpdateProfile(@Res() response, @Req() request, @Body() user: UserDto){
    const data = await this.authService.updateUser(user, request);
    return response.status(data.status).json(data.response)
  }
}
