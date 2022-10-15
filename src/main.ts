import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UnprocessableEntityExceptionFilter } from 'exception-filters/unprocessable-entity.exception';
import { InternalServerErrorExceptionFilter } from 'exception-filters/http.exception';
import { UnAuthorizedErrorExceptionFilter } from 'exception-filters/unauthorized.exception';
import { HttpStatus, UnauthorizedException, ValidationPipe } from '@nestjs/common';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors()
  app.useGlobalFilters(new UnprocessableEntityExceptionFilter, new UnAuthorizedErrorExceptionFilter, new InternalServerErrorExceptionFilter)
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    validationError: { target: false, value: false }
  }));
  await app.listen(process.env.PORT);
  console.log(`Listening on port ${process.env.PORT}...`);
}
bootstrap();
