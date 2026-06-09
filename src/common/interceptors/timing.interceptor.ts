import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';

import { tap } from 'rxjs/operators';

@Injectable()
export class TimingInterceptor
  implements NestInterceptor {

  private logger =
    new Logger('HTTP');

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ) {

    const request =
      context.switchToHttp().getRequest();

    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const ms =
          Date.now() - start;

        this.logger.log(
          `${request.method} ${request.url} -> ${ms}ms`,
        );
      }),
    );
  }
}