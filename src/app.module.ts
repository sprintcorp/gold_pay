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

@Module({
  imports: [
    AuthModule,
    HttpModule.registerAsync({
      useClass: HttpConfigService,
    }),

    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),

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
          // dir: process.cwd() + '/templates/registration-email.hbs',
          dir: __dirname + '/templates',
          adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
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
  controllers: [ AuthController, SubscriptionController],
  providers: [AuthService, SubscriptionService, GetUserTokenData],
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
