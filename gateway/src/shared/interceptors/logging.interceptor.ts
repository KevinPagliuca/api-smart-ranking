import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(
    ctx: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    const res = ctx.switchToHttp().getResponse();

    res.on('close', () => {
      const logger = new Logger(res.req.method);
      logger.verbose(
        `${res.req.url} | ${res.statusCode} | ${res.statusMessage}`,
      );
    });

    return next.handle();
  }
}
