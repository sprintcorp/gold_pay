import { Body, Controller, Delete, Get, HttpStatus, Param, Post, UploadedFiles, Put, Req, Res } from "@nestjs/common";
import { User } from "../models/user.schema";
import { AuthService } from "../services/auth.service";
import { JwtService } from '@nestjs/jwt'
import { MailerService } from "@nestjs-modules/mailer";
// import { EventEmitterModule } from "@nestjs/event-emitter";
import {MailEvent} from "../events/mail.event";


@Controller('/api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
              private jwtService: JwtService,
              private mailService: MailerService,
              // private eventEmitter: EventEmitterModule
  ) {
  }

  @Post('/signup')
  async Signup(@Res() response, @Body() user: User) {

    const newUser = await this.authService.signup(user, response);


    // this.eventEmitter.emit('verify_mail',
    //   new MailEvent(this.mailService, newUser)
    // )
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

  @Post('/signin')
  async SignIn(@Res() response, @Body() user: User) {
    const token = await this.authService.signin(user, this.jwtService);
    return response.status(HttpStatus.OK).json(token)
  }

  @Post('/verify')
  async VerifyUser(@Res() response, @Body() request) {
    const verify = await this.authService.activateAccount(request);
    return response.status(HttpStatus.OK).json(verify)
  }

  @Post('/resend-otp')
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
}
