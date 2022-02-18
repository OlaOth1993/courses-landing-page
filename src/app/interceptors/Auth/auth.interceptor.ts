import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from 'src/app/services/storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private storageService: StorageService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token: string = this.storageService.getToken();

    let headers: HttpHeaders = request.headers
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    let clonedRequest = request.clone({ headers });

    if (token) {
      headers = request.headers.set('Authorization', `Bearer ${token}`);
      clonedRequest = request.clone({ headers });
      return next.handle(clonedRequest);
    } else {
      return next.handle(clonedRequest);
    }
  }
}
