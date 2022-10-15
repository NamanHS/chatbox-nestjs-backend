import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException, UnprocessableEntityException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(UnprocessableEntityException)
export class UnprocessableEntityExceptionFilter implements ExceptionFilter {
  catch(exception: UnprocessableEntityException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const errResponse: any = exception.getResponse()
    const errors = errResponse.hasOwnProperty('message') && typeof errResponse.message == 'object' ?
      [...errResponse.message] : [errResponse.message]
    response
      .status(status)
      .json({
        status: 0,
        message: "Cannot Process this Request",
        errors
      });
  }
}