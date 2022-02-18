import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable()
export class LoggerInterceptor implements HttpInterceptor {
  constructor() {}
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const started: Date | number = Date.now();
    return next.handle(request).pipe(
      finalize(() => {
        const elapsed: number = Date.now() - started;
        // console.log(`${request.method} ${request.url} took ${elapsed} ms`);
      })
    );
  }
}
