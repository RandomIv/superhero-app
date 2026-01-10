import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse: any = exception.getResponse();

    let messages: string[];

    if (typeof exceptionResponse === 'object' && exceptionResponse.message) {
      if (Array.isArray(exceptionResponse.message)) {
        messages = exceptionResponse.message;
      } else {
        messages = [exceptionResponse.message];
      }
    } else if (typeof exceptionResponse === 'string') {
      messages = [exceptionResponse];
    } else {
      messages = ['An unexpected error occurred'];
    }

    response.status(status).json({
      message: messages,
      error: exceptionResponse.error || 'Http Exception',
      statusCode: status,
    });
  }
}
