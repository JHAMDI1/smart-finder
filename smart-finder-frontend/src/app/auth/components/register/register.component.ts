import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-900">Créer un compte</h1>
          <p class="text-gray-600 mt-2">Rejoignez Smart Finder</p>
        </div>

        <!-- Form -->
        <form (ngSubmit)="onSubmit()" class="space-y-4">
          <!-- Nom & Prenom -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nom</label>
              <input
                type="text"
                [(ngModel)]="nom"
                name="nom"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Dupont"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
              <input
                type="text"
                [(ngModel)]="prenom"
                name="prenom"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Marie"
              />
            </div>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              [(ngModel)]="email"
              name="email"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="votre@email.com"
            />
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
            <input
              type="password"
              [(ngModel)]="password"
              name="password"
              required
              minlength="6"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="••••••••"
            />
            <p class="text-xs text-gray-500 mt-1">Minimum 6 caractères</p>
          </div>

          <!-- Error Message -->
          <div *ngIf="error" class="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {{ error }}
          </div>

          <!-- Success Message -->
          <div *ngIf="success" class="bg-green-50 text-green-600 p-3 rounded-lg text-sm">
            {{ success }}
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            [disabled]="loading"
            class="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span *ngIf="!loading">S'inscrire</span>
            <span *ngIf="loading">Inscription...</span>
          </button>
        </form>

        <!-- Login Link -->
        <p class="text-center mt-6 text-sm text-gray-600">
          Déjà un compte ?
          <a routerLink="/login" class="text-primary-600 hover:text-primary-700 font-medium">Se connecter</a>
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
  loading = false;
  error: string | null = null;
  success: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    // Validation
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
      password: this.password
    }).subscribe({
      next: () => {
        this.success = 'Compte créé avec succès ! Redirection...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err: unknown) => {
        this.error = (err as { error?: { message?: string } })?.error?.message || 'Erreur lors de l\'inscription';
        this.loading = false;
      }
    });
  }
}
