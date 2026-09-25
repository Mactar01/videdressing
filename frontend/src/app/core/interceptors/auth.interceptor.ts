import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpXsrfTokenExtractor } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const xsrfTokenExtractor = inject(HttpXsrfTokenExtractor);
  const isApiUrl = req.url.startsWith('/api') || req.url.startsWith('/sanctum');
  
  if (isApiUrl) {
    // Par défaut on attache withCredentials et Accept
    let headers = req.headers.set('Accept', 'application/json');

    // On récupère le jeton CSRF et on le force dans le Header pour Laravel
    const token = xsrfTokenExtractor.getToken();
    if (token) {
      headers = headers.set('X-XSRF-TOKEN', token);
    }

    req = req.clone({
      withCredentials: true,
      headers: headers
    });
  }
  
  return next(req);
};
