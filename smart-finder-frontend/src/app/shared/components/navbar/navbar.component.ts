import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Mobile Bottom Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
      <div class="flex justify-around items-center h-16">
        <!-- Home -->
        <a 
          routerLink="/lieux" 
          class="flex flex-col items-center justify-center w-full h-full text-gray-600 hover:text-primary-600"
          [class.text-primary-600]="isActive('/lieux')"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
          <span class="text-xs mt-1">Accueil</span>
        </a>

        <!-- Search -->
        <a 
          routerLink="/lieux" 
          class="flex flex-col items-center justify-center w-full h-full text-gray-600 hover:text-primary-600"
          [class.text-primary-600]="isActive('/search')"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <span class="text-xs mt-1">Recherche</span>
        </a>

        <!-- Profile/Login -->
        <a 
          *ngIf="!isLoggedIn()"
          routerLink="/login" 
          class="flex flex-col items-center justify-center w-full h-full text-gray-600 hover:text-primary-600"
          [class.text-primary-600]="isActive('/login')"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
          </svg>
          <span class="text-xs mt-1">Connexion</span>
        </a>

        <button 
          *ngIf="isLoggedIn()"
          (click)="logout()"
          class="flex flex-col items-center justify-center w-full h-full text-gray-600 hover:text-red-600"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          <span class="text-xs mt-1">Déconnexion</span>
        </button>
      </div>
    </nav>

    <!-- Desktop Top Navigation -->
    <nav class="hidden md:block fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <a routerLink="/lieux" class="flex items-center gap-2">
            <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <span class="font-bold text-xl text-gray-900">Smart Finder</span>
          </a>

          <!-- Navigation Links -->
          <div class="flex items-center gap-6">
            <a 
              routerLink="/lieux" 
              class="text-gray-600 hover:text-primary-600 font-medium"
              [class.text-primary-600]="isActive('/lieux')"
            >
              Lieux
            </a>

            <ng-container *ngIf="!isLoggedIn()">
              <a 
                routerLink="/login" 
                class="text-gray-600 hover:text-primary-600 font-medium"
                [class.text-primary-600]="isActive('/login')"
              >
                Connexion
              </a>
              <a 
                routerLink="/register" 
                class="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                S'inscrire
              </a>
            </ng-container>

            <ng-container *ngIf="isLoggedIn()">
              <span class="text-gray-600">{{ getUserName() }}</span>
              <button 
                (click)="logout()"
                class="text-red-600 hover:text-red-700 font-medium"
              >
                Déconnexion
              </button>
            </ng-container>
          </div>
        </div>
      </div>
    </nav>

    <!-- Spacer for desktop -->
    <div class="hidden md:block h-16"></div>
    <!-- Spacer for mobile -->
    <div class="md:hidden h-16"></div>
  `
})
export class NavbarComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  getUserName(): string {
    const user = this.authService.getCurrentUser();
    return user ? `${user.prenom} ${user.nom}` : '';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  isActive(path: string): boolean {
    return this.router.url.startsWith(path);
  }
}
