import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let messages: string | string[];

    if (exception instanceof HttpException) {
      messages = (exception as HttpException).message;
      status = exception.getStatus();
    } else {
      status = 500;
      messages = 'Internal server error';
    }
    Logger.error(exception);

    messages = Array.isArray(messages) ? messages : [messages];

    response.status(status).json({
      statusCode: status,
      messages,
      timestamp: new Date().toLocaleString(),
      path: request.url,
    });
  }
}
