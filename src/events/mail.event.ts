import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { User } from "../models/user.schema";

// @Injectable()
export class MailEvent{
  // constructor(private mailService: MailerService, private user: User){}


  @OnEvent('notify_user')
  async handleNotifyUser () {
    console.log("event emmitted");
  }

}
