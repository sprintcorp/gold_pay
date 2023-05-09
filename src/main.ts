import { HttpAdapterHost, NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from './app.module';
import { HttpExceptionFilter } from "./handlers/http-exception.filter";
import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalPipes(new ValidationPipe({whitelist: true}));
  // app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  console.log(parseInt(process.env.PORT, 10));
  await app.listen(parseInt(process.env.PORT, 10) || 3000);

}
bootstrap();
