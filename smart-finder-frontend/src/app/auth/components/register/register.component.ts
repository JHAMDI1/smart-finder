import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4 pt-24 pb-28">
      <div class="w-full max-w-lg bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 sm:p-8 md:p-10 border border-gray-100 relative overflow-hidden">
        <!-- Top Gradient Bar -->
        <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-500 to-indigo-500"></div>

        <!-- Header -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/30">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
            </svg>
          </div>
          <h1 class="text-2xl font-extrabold text-gray-900 tracking-tight">Créer un compte</h1>
          <p class="text-gray-500 mt-2">Rejoignez la communauté SmartFinder</p>
        </div>

        <!-- Form -->
        <form (ngSubmit)="onSubmit()" class="space-y-5">
          <!-- Nom & Prenom -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1.5">Nom</label>
              <input
                type="text"
                [(ngModel)]="nom"
                name="nom"
                required
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-gray-50 focus:bg-white"
                placeholder="Dupont"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1.5">Prénom</label>
              <input
                type="text"
                [(ngModel)]="prenom"
                name="prenom"
                required
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-gray-50 focus:bg-white"
                placeholder="Marie"
              />
            </div>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
            <input
              type="email"
              [(ngModel)]="email"
              name="email"
              required
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-gray-50 focus:bg-white"
              placeholder="votre&#64;email.com"
            />
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Mot de passe</label>
            <input
              type="password"
              [(ngModel)]="password"
              name="password"
              required
              minlength="6"
              autocomplete="new-password"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-gray-50 focus:bg-white"
              placeholder="••••••••"
            />
            <p class="text-xs text-gray-400 mt-1.5">Minimum 6 caractères</p>
          </div>

          <!-- Role Selector -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Je suis...</label>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <!-- User -->
              <button type="button" (click)="role = 'USER'"
                [ngClass]="role === 'USER' ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500/20' : 'border-gray-200 bg-gray-50 hover:border-gray-300'"
                class="p-4 rounded-2xl border-2 transition-all text-center cursor-pointer">
                <div class="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center"
                     [ngClass]="role === 'USER' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-400'">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
                <span class="text-sm font-bold" [ngClass]="role === 'USER' ? 'text-primary-700' : 'text-gray-600'">Utilisateur</span>
                <p class="text-xs mt-0.5" [ngClass]="role === 'USER' ? 'text-primary-500' : 'text-gray-400'">Explorer</p>
              </button>

              <!-- Owner -->
              <button type="button" (click)="role = 'OWNER'"
                [ngClass]="role === 'OWNER' ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500/20' : 'border-gray-200 bg-gray-50 hover:border-gray-300'"
                class="p-4 rounded-2xl border-2 transition-all text-center cursor-pointer">
                <div class="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center"
                     [ngClass]="role === 'OWNER' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                </div>
                <span class="text-sm font-bold" [ngClass]="role === 'OWNER' ? 'text-indigo-700' : 'text-gray-600'">Propriétaire</span>
                <p class="text-xs mt-0.5" [ngClass]="role === 'OWNER' ? 'text-indigo-500' : 'text-gray-400'">Gérer</p>
              </button>

              <!-- Admin -->
              <button type="button" (click)="role = 'ADMIN'"
                [ngClass]="role === 'ADMIN' ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-500/20' : 'border-gray-200 bg-gray-50 hover:border-gray-300'"
                class="p-4 rounded-2xl border-2 transition-all text-center cursor-pointer">
                <div class="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center"
                     [ngClass]="role === 'ADMIN' ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-400'">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
                </div>
                <span class="text-sm font-bold" [ngClass]="role === 'ADMIN' ? 'text-amber-700' : 'text-gray-600'">Admin</span>
                <p class="text-xs mt-0.5" [ngClass]="role === 'ADMIN' ? 'text-amber-500' : 'text-gray-400'">Gérer tout</p>
              </button>
            </div>
          </div>

          <!-- Error Message -->
          <div *ngIf="error" class="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100">
            {{ error }}
          </div>

          <!-- Success Message -->
          <div *ngIf="success" class="bg-green-50 text-green-600 p-3 rounded-xl text-sm border border-green-100">
            {{ success }}
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            [disabled]="loading"
            class="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-gray-900/20 hover:-translate-y-0.5"
          >
            <span *ngIf="!loading">Créer mon compte</span>
            <span *ngIf="loading" class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              Inscription...
            </span>
          </button>
        </form>

        <!-- Login Link -->
        <p class="text-center mt-6 text-sm text-gray-500">
          Déjà un compte ?
          <a routerLink="/login" class="text-primary-600 hover:text-primary-700 font-semibold">Se connecter</a>
        </p>
      </div>
    </div>
  `
})
export class RegisterComponent {
  nom = '';
  prenom = '';
  email = '';
  password = '';
  role: 'USER' | 'OWNER' | 'ADMIN' = 'USER';
  loading = false;
  error: string | null = null;
  success: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onSubmit(): void {
    if (!this.nom || !this.prenom || !this.email || !this.password) {
      this.error = 'Veuillez remplir tous les champs';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'Le mot de passe doit contenir au moins 6 caractères';
      return;
    }

    this.loading = true;
    this.error = null;
    this.success = null;

    this.authService.register({
      nom: this.nom,
      prenom: this.prenom,
      email: this.email,
      password: this.password,
      role: this.role
    }).subscribe({
      next: () => {
        this.success = 'Compte créé avec succès ! Redirection...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err: unknown) => {
        this.error = (err as { error?: { message?: string } })?.error?.message || "Erreur lors de l'inscription";
        this.loading = false;
      }
    });
  }
}
