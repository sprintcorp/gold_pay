import { NestFactory } from "@nestjs/core";
import { AppModule } from './app.module';
import { HttpExceptionFilter } from "./handlers/http-exception.filter";
import {  ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
});
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalPipes(new ValidationPipe({whitelist: true}));
  await app.listen(parseInt(process.env.PORT, 10) || 3000);
}
bootstrap();
