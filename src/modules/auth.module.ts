import { Module } from '@nestjs/common';
import {AuthService} from "../services/auth.service";
import {AuthController} from "../controllers/auth.controller";
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/models/user.schema';
import { GetUserTokenData } from 'src/utils/GetUserTokenData';
import { HttpService as http } from "@nestjs/axios";

@Module({
  providers: [AuthService],
  controllers: [AuthController],

  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          UserSchema.pre('save', async function(next: any) {
            const httpReq = new http();
            const tokenRes = new GetUserTokenData(httpReq);
            const data = await tokenRes.getWalletInformation()
            this.address = data.address;
            this.private_key = data.privateKey;
            next();
          });
        },
      },
    ]),
  ],
})

export class AuthModule {
  
}
