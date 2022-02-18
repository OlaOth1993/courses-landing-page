import { ToastService } from 'src/app/services/toast.service';
import { Inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpErrorResponse,
  HttpEvent,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    public toastService: ToastService
  ) {}
  //!Global scope error handling
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return next.handle(request).pipe(
      //TODO: Reactivate the following line on production
      retry(1),
      catchError((error: HttpErrorResponse) => {
        //TODO: Make a global enum for error codes
        let message = 'INTERCEPTED';
        if (error.error instanceof ProgressEvent) {
          // handle client-side error
          this.toastService.show(undefined,
            {
              title: "Error!",
              description: "Something went wrong",
              icon:"assets/icons/errors/500-internal-server.svg"
            })
        } else {
          // handle server-side error
          //TODO: Manage global response error
          //-> i.e. 401, 404, 500, etc..
          //-> Also refresh token for expired token error
          switch (error.status) {
            case 401: //login
              break;
            case 500:
              this.toastService.show(undefined,
                {
                  class: "custom",
                  title: "Error!",
                  description: "500 Internal server error",
                  icon:"assets/icons/errors/500-internal-server.svg"
                })
              break;
            case 403: //forbidden
              break;
            case 404: //404
              this.router.navigateByUrl('/404');
              //TODO: We can either do it this way (useful when navigating outside the app)
              //-> this.document.location.href = 'https://www.google.com';
              //TODO: Or we can simply use angular router, like in this way
              //-> this.router.navigateByUrl('')
              break;
          }
        }
        return throwError(error);
        //! Disable error messages by returning a new Observable
        //-> return new Observable<HttpEvent<any>>();
      })
    );
  }
}
