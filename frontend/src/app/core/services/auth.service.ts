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
  private apiUrl = ''; // On utilise le proxy Angular désormais !
  
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
   * Tente de récupérer le profil de l'utilisateur s'il est déjà connecté via les cookies
   */
  checkAuthStatus(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/api/v1/auth/me`).pipe(
      tap(user => this.currentUserSubject.next(user))
    );
  }

  /**
   * Connecte l'utilisateur
   */
  login(credentials: any): Observable<User> {
    return this.csrfCookie().pipe(
      // 1. Obtenir le cookie
      switchMap(() => this.http.post(`${this.apiUrl}/api/v1/auth/login`, credentials)),
      // 2. Se connecter
      switchMap(() => this.checkAuthStatus())
      // 3. Récupérer et stocker l'utilisateur, ce qui autorisera l'AuthGuard
    );
  }

  /**
   * Déconnecte l'utilisateur
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
