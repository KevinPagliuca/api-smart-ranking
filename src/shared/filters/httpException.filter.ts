import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);
  catch(exception: unknown, host: ArgumentsHost) {
    const isHttpException = exception instanceof HttpException;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = isHttpException ? exception.getResponse() : exception;

    this.logger.error(
      `Http Status: ${status}, Error: ${JSON.stringify(message)}`,
    );

    return response.status(status).json({
      ...(typeof message === 'object' ? message : { message }),
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
