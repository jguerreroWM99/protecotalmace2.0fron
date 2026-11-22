import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth-services';

export const userHeaderInterceptorsInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const userId = authService.obtenerUsuarioId();

  if (userId && req.url.includes('/api/') && !req.url.includes('/api/auth/')) {
    const clonedReq = req.clone({
      setHeaders: {
        'X-User-Id': userId.toString()
      }
    });
    return next(clonedReq);
  }

  return next(req);
};
