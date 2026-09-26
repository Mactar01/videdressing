import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, switchMap, map } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  is_admin: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = ''; // On utilise le proxy Angular désormais !
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('auth_token')) {
      this.checkAuthStatus().subscribe({
        error: () => {
          this.currentUserSubject.next(null);
          localStorage.removeItem('auth_token');
        }
      });
    }
  }



  /**
   * Tente de récupérer le profil de l'utilisateur s'il est déjÃ  connecté via les cookies
   */
  checkAuthStatus(): Observable<User> {
    return this.http.get<any>(`${this.apiUrl}/api/v1/auth/me`).pipe(
      map(res => res.data || res.user || res),
      tap(user => this.currentUserSubject.next(user))
    );
  }

  /**
   * Connecte l'utilisateur
   */
  login(credentials: any): Observable<User> {
    return this.http.post<any>(`${this.apiUrl}/api/v1/auth/login`, credentials).pipe(
      tap(res => {
        const token = res.data?.token || res.token;
        if (token && typeof localStorage !== 'undefined') {
          localStorage.setItem('auth_token', token);
        }
      }),
      map(res => res.data?.user || res.user || res.data || res),
      tap(user => this.currentUserSubject.next(user))
    );
  }

  /**
   * Inscrit l'utilisateur
   */
  register(credentials: {name: string, phone: string, email?: string}): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/v1/auth/register`, credentials);
  }

  /**
   * Envoie un OTP au téléphone
   */
  sendOtp(phone: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/v1/auth/send-otp`, { phone });
  }

  /**
   * Vérifie le code OTP pour se connecter
   */
  verifyOtp(phone: string, code: string): Observable<User> {
    return this.http.post<any>(`${this.apiUrl}/api/v1/auth/verify-otp`, { phone, code }).pipe(
      tap(res => {
        const token = res.data?.token || res.token;
        if (token && typeof localStorage !== 'undefined') {
          localStorage.setItem('auth_token', token);
        }
      }),
      map(res => res.data?.user || res.user || res.data || res),
      tap(user => this.currentUserSubject.next(user))
    );
  }

  /**
   * Déconnecte l'utilisateur
   */
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/v1/auth/logout`, {}).pipe(
      tap(() => {
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem('auth_token');
        }
        this.currentUserSubject.next(null);
      })
    );
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
}
