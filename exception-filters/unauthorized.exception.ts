import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException, UnprocessableEntityException, HttpException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(UnauthorizedException)
export class UnAuthorizedErrorExceptionFilter implements ExceptionFilter {
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
                message: errResponse.message || "You are not Authorized to use the resource",
                errors: []
            });
    }
}