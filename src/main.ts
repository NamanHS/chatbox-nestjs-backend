import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UnprocessableEntityExceptionFilter } from 'exception-filters/unprocessable-entity.exception';
import { InternalServerErrorExceptionFilter } from 'exception-filters/http.exception';
import { UnAuthorizedErrorExceptionFilter } from 'exception-filters/unauthorized.exception';
import { HttpStatus, UnauthorizedException, ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  /* Hybrid App Setup */
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 4010
    }
  });
  

  app.enableCors()
  app.useGlobalFilters(new UnprocessableEntityExceptionFilter, new UnAuthorizedErrorExceptionFilter, new InternalServerErrorExceptionFilter)
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    validationError: { target: false, value: false }
  }));
  await app.listen(process.env.PORT);
  await app.startAllMicroservicesAsync();
  console.log(`Listening on port ${process.env.PORT}...`);
}
bootstrap();
