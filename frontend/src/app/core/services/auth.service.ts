import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, switchMap } from 'rxjs';

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
  private apiUrl = ''; // On utilise le proxy Angular dÃ©sormais !
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.checkAuthStatus().subscribe({
      error: () => this.currentUserSubject.next(null)
    });
  }

  /**
   * Initialise la protection CSRF de Sanctum
   */
  private csrfCookie(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sanctum/csrf-cookie`);
  }

  /**
   * Tente de rÃ©cupÃ©rer le profil de l'utilisateur s'il est dÃ©jÃ  connectÃ© via les cookies
   */
  checkAuthStatus(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/api/v1/auth/me`).pipe(
      tap(user => this.currentUserSubject.next(user))
    );
  }

  /**
   * Connecte l'utilisateur
   */

  /**
   * Inscrit l'utilisateur
   */
  register(credentials: {name: string, phone: string, email?: string}): Observable<User> {
    return this.csrfCookie().pipe(
      switchMap(() => this.http.post<any>(this.apiUrl + '/api/v1/auth/register', credentials)),
      switchMap(() => this.checkAuthStatus())
    );
  }

  /**
   * Envoie un OTP au téléphone
   */
  sendOtp(phone: string): Observable<any> {
    return this.csrfCookie().pipe(
      switchMap(() => this.http.post(`${this.apiUrl}/api/v1/auth/send-otp`, { phone }))
    );
  }

  /**
   * Vérifie le code OTP pour se connecter
   */
  verifyOtp(phone: string, code: string): Observable<User> {
    return this.csrfCookie().pipe(
      switchMap(() => this.http.post(`${this.apiUrl}/api/v1/auth/verify-otp`, { phone, code })),
      switchMap(() => this.checkAuthStatus())
    );
  }

  /**
   * DÃ©connecte l'utilisateur
   */
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/v1/auth/logout`, {}).pipe(
      tap(() => this.currentUserSubject.next(null))
    );
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
}
