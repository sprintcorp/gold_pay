import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { User } from "../models/user.schema";

@Injectable()
export class MailEvent{
  constructor(private mailService: MailerService, private user: User){}


  async notifyUser () {
    await this.mailService.sendMail({
      to:this.user.email,
      from:"nani.bommidi93@gmail.com",
      subject: 'Account verification',
      template:'registration-email',
      context: {
        data:this.user
      }

    });
  }

}
