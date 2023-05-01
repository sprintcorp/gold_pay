import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { AppModule } from './app.module';
import { HttpExceptionFilter } from "./handlers/http-exception.filter";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalPipes(new ValidationPipe({whitelist: true}));

  console.log(parseInt(process.env.APP_PORT, 10));
  await app.listen(parseInt(process.env.APP_PORT, 10) || 3000);

}
bootstrap();
