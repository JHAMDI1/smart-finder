import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <!-- Desktop Top Navigation (Glassmorphism) -->
    <nav class="hidden md:block fixed top-0 w-full z-50 transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <!-- Logo -->
        <a routerLink="/lieux" class="flex items-center gap-3 group">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:scale-105 transition-transform">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </div>
          <span class="font-bold text-2xl bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent tracking-tight">SmartFinder</span>
        </a>

        <!-- Main Nav Links -->
        <div class="flex items-center gap-8">
          <a routerLink="/lieux" routerLinkActive="text-primary-600 font-semibold" [routerLinkActiveOptions]="{exact: true}" class="text-gray-500 hover:text-gray-900 transition-colors font-medium">Explorer</a>
          <a routerLink="/smart-search" routerLinkActive="text-primary-600 font-semibold" class="text-gray-500 hover:text-gray-900 transition-colors font-medium flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
            IA Search
          </a>
        </div>

        <!-- Auth / Profile -->
        <div class="flex items-center gap-4">
          <ng-container *ngIf="isOwner()">
            <a routerLink="/owner/dashboard" routerLinkActive="text-primary-600 font-semibold" class="hidden md:flex items-center gap-2 text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-4 py-2 rounded-lg font-medium transition-colors border border-primary-200">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
              Espace Pro
            </a>
          </ng-container>

          <ng-container *ngIf="!isLoggedIn(); else userProfile">
            <a routerLink="/login" class="text-gray-600 hover:text-gray-900 font-medium px-4 py-2 transition-colors">Connexion</a>
            <a routerLink="/register" class="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-full font-medium transition-all hover:shadow-lg hover:-translate-y-0.5">S'inscrire</a>
          </ng-container>
          <ng-template #userProfile>
            <div class="flex items-center gap-4 border-l pl-6 border-gray-200">
              <div class="flex flex-col items-end">
                <span class="text-sm font-semibold text-gray-900">{{ getUserName() }}</span>
                <span class="text-xs text-primary-600 uppercase tracking-wider font-bold">{{ getRole() }}</span>
              </div>
              <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-100 to-indigo-100 border-2 border-white shadow-sm flex items-center justify-center text-primary-700 font-bold">
                {{ getUserInitials() }}
              </div>
              <button (click)="logout()" class="ml-2 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors" title="Déconnexion">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
              </button>
            </div>
          </ng-template>
        </div>
      </div>
    </nav>

    <!-- Mobile Bottom Navigation (Floating island style) -->
    <nav class="md:hidden fixed bottom-6 left-4 right-4 z-50">
      <div class="bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-gray-900/40 p-2 flex justify-around items-center border border-gray-800">
        <!-- Home -->
        <a routerLink="/lieux" routerLinkActive="bg-white/10 text-white" [routerLinkActiveOptions]="{exact: true}" class="flex flex-col items-center justify-center w-16 h-14 rounded-xl text-gray-400 hover:text-white transition-all">
          <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
          <span class="text-[10px] font-medium">Lieux</span>
        </a>

        <!-- Search -->
        <a routerLink="/smart-search" routerLinkActive="bg-primary-500/20 text-primary-400" class="flex flex-col items-center justify-center w-16 h-14 rounded-xl text-gray-400 hover:text-white transition-all">
          <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <span class="text-[10px] font-medium">Finder</span>
        </a>

        <!-- Auth / Profile -->
        <ng-container *ngIf="!isLoggedIn(); else mobileProfile">
          <a routerLink="/login" routerLinkActive="bg-white/10 text-white" class="flex flex-col items-center justify-center w-16 h-14 rounded-xl text-gray-400 hover:text-white transition-all">
            <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            <span class="text-[10px] font-medium">Profil</span>
          </a>
        </ng-container>
        <ng-template #mobileProfile>
          <button (click)="logout()" class="flex flex-col items-center justify-center w-16 h-14 rounded-xl text-gray-400 hover:text-red-400 transition-all">
            <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            <span class="text-[10px] font-medium">Sortir</span>
          </button>
        </ng-template>
      </div>
    </nav>

    <!-- Spacers -->
    <div class="hidden md:block h-20"></div>
    <div class="md:hidden h-0"></div> <!-- Floating bottom nav doesn't need spacer -->
  `
})
export class NavbarComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  isOwner(): boolean {
    return this.authService.hasRole('OWNER');
  }

  getUserName(): string {
    const user = this.authService.getCurrentUser();
    return user ? user.prenom : '';
  }

  getUserInitials(): string {
    const user = this.authService.getCurrentUser();
    if (!user) return '?';
    return (user.prenom.charAt(0) + user.nom.charAt(0)).toUpperCase();
  }

  getRole(): string {
    const user = this.authService.getCurrentUser();
    return user ? user.role : '';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
