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

      // await this.mailService.sendMail({
      //   to:user.email,
      //   from:"nani.bommidi93@gmail.com",
      //   subject: 'Account verification',
      //   template:'registration-email',
      //   context: {
      //     data:newUser
      //   }
      //
      // });
    return response.status(HttpStatus.CREATED).json({
      newUser
    })
  }

  @Post('/signin')
  async SignIn(@Res() response, @Body() user: User) {
    const token = await this.authService.signin(user, this.jwtService);
    return response.status(HttpStatus.OK).json(token)
  }
}
