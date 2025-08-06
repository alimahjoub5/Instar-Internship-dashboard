import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

let isRefreshing = false;

export const AuthInterceptor: HttpInterceptorFn = (request, next) => {
  const userService = inject(UserService);
  const router = inject(Router);
  
  const token = userService.getToken();
  
  if (token) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !request.url.includes('login')) {
        return handle401Error(request, next, userService, router);
      }
      return throwError(() => error);
    })
  );
};

function handle401Error(
  request: any, 
  next: any, 
  userService: UserService, 
  router: Router
): Observable<any> {
  if (!isRefreshing) {
    isRefreshing = true;
    const refreshToken = userService.getRefreshToken();
    const userId = userService.getUserId();

    if (refreshToken && userId) {
      return userService.refreshToken(refreshToken, userId).pipe(
        switchMap((response) => {
          isRefreshing = false;
          userService.storeAuthData(response);
          
          // Retry the original request with new token
          const newRequest = request.clone({
            setHeaders: {
              Authorization: `Bearer ${response.token}`
            }
          });
          return next(newRequest);
        }),
        catchError((error) => {
          isRefreshing = false;
          userService.removeToken();
          router.navigate(['/login']);
          return throwError(() => error);
        })
      );
    } else {
      isRefreshing = false;
      userService.removeToken();
      router.navigate(['/login']);
      return throwError(() => new Error('No refresh token available'));
    }
  }
  return throwError(() => new Error('Token refresh in progress'));
}