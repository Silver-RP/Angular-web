import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(private authService: AuthService, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    console.log('Token:', token);

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !this.isRefreshing) {
          this.isRefreshing = true; 

          return this.authService.refreshToken().pipe(
            switchMap((newToken: string) => {
              localStorage.setItem('token', newToken);
              this.isRefreshing = false;

              const clonedRequest = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`,
                },
              });
              return next.handle(clonedRequest);
            }),
            catchError((refreshError) => {
              console.error('Refresh token expired or invalid:', refreshError);

              this.isRefreshing = false; 
              alert('Your session has expired. Please log in again.');

              return this.authService.logoutUser().pipe(
                switchMap(() => {
                  localStorage.clear();
                  this.router.navigate(['/client/login']).then(() => {
                    window.location.reload();
                  });

                  return throwError(() => refreshError);
                })
              );
            })
          );
        }

        return throwError(() => error);
      })
    );
  }
}

