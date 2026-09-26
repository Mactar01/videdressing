import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const isApiUrl = req.url.startsWith('/api') || req.url.startsWith('/sanctum') || req.url.startsWith('http://localhost:8000');
  
  if (isApiUrl) {
    let headers = req.headers.set('Accept', 'application/json');

    if (typeof localStorage !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        if (token) {
            headers = headers.set('Authorization', `Bearer ${token}`);
        }
    }

    req = req.clone({
      headers: headers
    });
  }
  
  return next(req);
};