import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Utilisateur, RegisterRequest, LoginRequest, AuthResponse } from '../models/utilisateur.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<Utilisateur | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isBrowser: boolean;

  constructor(private http: HttpClient) {
    this.isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
    if (this.isBrowser) {
      const stored = localStorage.getItem('currentUser');
      if (stored && stored !== 'undefined') {
        try {
          this.currentUserSubject.next(JSON.parse(stored));
        } catch (e) {
          console.error('Failed to parse currentUser from localStorage', e);
          localStorage.removeItem('currentUser');
        }
      } else if (stored === 'undefined') {
        localStorage.removeItem('currentUser');
      }
    }
  }

  register(request: RegisterRequest): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(`${this.apiUrl}/register`, request);
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(response => {
        const user: Utilisateur = {
          id: response.id,
          email: response.email,
          nom: response.nom,
          prenom: response.prenom,
          role: response.role
        };

        if (this.isBrowser) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
        this.currentUserSubject.next(user);
      })
    );
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem('token');
    }
    return null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user ? user.role === role : false;
  }

  getCurrentUser(): Utilisateur | null {
    return this.currentUserSubject.value;
  }
}
