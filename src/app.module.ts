import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { join } from "path/posix";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./models/user.schema";
import { ServeStaticModule } from "@nestjs/serve-static";
import { JwtModule } from "@nestjs/jwt";
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { v4 as uuidv4 } from 'uuid';
import { AuthController } from "./controllers/auth.controller";
import { AuthService } from "./services/auth.service";
import { secret } from "./utils/constants";
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';
import { isAuthenticated } from "./middlewares/app.middleware";
import { SubscriptionController } from "./controllers/subscription.controller";
import { SubscriptionService } from "./services/subscription.service";
import { Subscription, SubscriptionSchema } from "./models/subscription.schema";
import { HttpModule } from "@nestjs/axios";
import { HttpConfigService } from "./utils/HttpConfigService";
import { AuthModule } from "./modules/auth.module";
import { GetUserTokenData } from "./utils/GetUserTokenData";
import { UserResources } from "./resources/user.resources";
import { PaymentList, PaymentListSchema } from "./models/paymentList.schema";
import { PaymentHistory, PaymentHistorySchema } from "./models/paymentHistory.schema";
import { PaymentService } from "./services/payment.service";
import { PaymentController } from "./controllers/payment.controller";
import { APP_GUARD } from "@nestjs/core";
import { RolesGuard } from "./utils/roles.guard";
import { ScheduleModule } from "@nestjs/schedule";
// import { SubscriptionModule } from "./modules/subscription.module";

@Module({
  imports: [
    AuthModule,
    // SubscriptionModule,
    HttpModule.registerAsync({
      useClass: HttpConfigService,
    }),


    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),

    
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          secure: true, // upgrade later with STARTTLS
          auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD,
          },
        },
        defaults: {
          from:process.env.SMTP_EMAIL,
        },
        template: {
          dir: __dirname + '/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),

    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }
    ]),
    MongooseModule.forFeature([
      {name: Subscription.name, schema: SubscriptionSchema}
    ]),
    MongooseModule.forFeature([
      {name: PaymentList.name, schema: PaymentListSchema}
    ]),
    MongooseModule.forFeature([
      {name: PaymentHistory.name, schema: PaymentHistorySchema}
    ]),

    MongooseModule.forRoot(process.env.DATABASE_CONNECTION_URL),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    JwtModule.register({
      global: true,
      secret:secret,
      signOptions: { expiresIn: process.env.TOKEN_EXPIRATION_TIME },
    }),

    MulterModule.register({
      storage: diskStorage({
        destination: './public',
        filename: (req, file, cb) => {
          const ext = file.mimetype.split('/')[1];
          cb(null, `${uuidv4()}-${Date.now()}.${ext}`);
        },
      })
    }),
  ],
  controllers: [SubscriptionController, PaymentController],
  providers: [AuthService, SubscriptionService, GetUserTokenData, UserResources, PaymentService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(isAuthenticated)
  //     .exclude(
  //       { path: 'api/v1/user/update-profile', method: RequestMethod.GET }
  //     )
  //     .forRoutes(AuthController);
  // }
}
