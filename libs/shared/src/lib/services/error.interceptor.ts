import { inject, Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ToastService } from './toast';
export const retryCount = 2;
export const retryWaitMilliSeconds = 1000;
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private router = inject(Router);
  private auth = inject(AuthService);
  private toast = inject(ToastService);

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let retryCounter = 0;
    return next.handle(request).pipe(
      retry({
        count: retryCount,
        delay: (error) => {
          retryCounter++;
          if (error.status >= 500 && retryCounter < retryCount) {
            return timer(retryWaitMilliSeconds);
          }
          return throwError(() => error);
        },
      }),
      catchError((error) => {
        const detail =
          typeof error.error === 'string'
            ? JSON.parse(error.error).detail
            : error.error?.detail ?? 'An unexpected error occurred';
        this.toast.show(detail, 'error');
        if (error.status === 401 || error.status === 403) {
          this.auth.logout();
        }
        return throwError(() => error);
      })
    );
  }
}
