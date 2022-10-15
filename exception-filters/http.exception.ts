import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException, UnprocessableEntityException, HttpException, InternalServerErrorException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(InternalServerErrorException)
export class InternalServerErrorExceptionFilter implements ExceptionFilter {
  catch(exception: InternalServerErrorException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const errResponse: any = exception.getResponse()
    response
      .status(status)
      .json({
        status: 0,
        message: "We are experiencing some technical issues at the moment, please try again in sometime.",
        errors: []
      });
  }
}