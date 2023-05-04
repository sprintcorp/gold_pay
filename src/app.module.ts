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

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: 'smtp.googlemail.com',
          port: 465,
          secure: true, // upgrade later with STARTTLS
          auth: {
            user: "sprintcorp7@gmail.com",
            pass: "tsfarsgobbnenfch",
          },
        },
        defaults: {
          from:'no-reply@goldpay.io',
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

    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),

    MongooseModule.forRoot('mongodb+srv://sprintcorp:COMPAQ2014@pickupcourierservice.ua3sz.mongodb.net/goldpay?retryWrites=true&w=majority'),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    JwtModule.register({
      global: true,
      secret:secret,
      signOptions: { expiresIn: '2h' },
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
  controllers: [ AuthController],
  providers: [AuthService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(isAuthenticated)
      .exclude(
        { path: 'api/v1/user/update-profile', method: RequestMethod.GET }
      )
      .forRoutes(AuthController);
  }
}
