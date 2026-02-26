import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AvisService, Avis } from '../../../services/avis.service';
import { AuthService } from '../../../../auth/services/auth.service';

@Component({
  selector: 'app-avis-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Loading & Error -->
      <div *ngIf="loading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
      <div *ngIf="error" class="bg-red-50 text-red-600 p-4 rounded-xl text-sm">
        {{ error }}
      </div>

      <!-- Add Review Form (Only if logged in) -->
      <div *ngIf="isLoggedIn" class="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 mb-8">
        <h3 class="text-xl font-bold text-gray-900 mb-4">Partagez votre expérience</h3>
        
        <form (ngSubmit)="submitAvis()" class="space-y-4">
          <!-- Rating Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Votre note</label>
            <div class="flex items-center gap-2">
              <button 
                type="button" 
                *ngFor="let star of [1, 2, 3, 4, 5]" 
                (click)="newAvis.note = star"
                (mouseenter)="hoverRating = star"
                (mouseleave)="hoverRating = 0"
                class="p-1 focus:outline-none transition-transform hover:scale-110"
              >
                <svg class="w-8 h-8 transition-colors duration-200" 
                     [ngClass]="(hoverRating || newAvis.note) >= star ? 'text-yellow-400' : 'text-gray-200'" 
                     fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Comment Input -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Votre avis (optionnel)</label>
            <textarea 
              [(ngModel)]="newAvis.commentaire" 
              name="commentaire" 
              rows="3" 
              class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all placeholder:text-gray-400 text-gray-700 resize-none"
              placeholder="Racontez-nous votre expérience dans ce lieu..."
            ></textarea>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end pt-2">
            <button 
              type="submit" 
              [disabled]="!newAvis.note || submitting"
              class="bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg *ngIf="submitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ submitting ? 'Envoi...' : 'Publier mon avis' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Login Prompt (If not logged in) -->
      <div *ngIf="!isLoggedIn" class="bg-primary-50/50 border border-primary-100 rounded-3xl p-6 text-center mb-8">
        <div class="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
        </div>
        <h4 class="text-lg font-bold text-gray-900 mb-2">Connectez-vous pour donner votre avis</h4>
        <p class="text-gray-600 mb-4 text-sm">Partagez votre expérience avec la communauté SmartFinder.</p>
        <a href="/login" class="inline-block bg-primary-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/20">
          Se connecter
        </a>
      </div>

      <!-- Reviews Summary (Dynamic mapping) -->
      <div class="flex items-center gap-4 mb-6" *ngIf="avis.length > 0">
        <h3 class="text-xl font-bold text-gray-900">Avis de nos utilisateurs</h3>
        <span class="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-semibold">{{ avis.length }} avis</span>
      </div>

      <!-- Empty State -->
      <div *ngIf="avis.length === 0 && !loading" class="text-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-3xl">
        <div class="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
          </svg>
        </div>
        <h3 class="text-lg font-bold text-gray-900 mb-2">Aucun avis pour l'instant</h3>
        <p class="text-gray-500">Soyez le premier à partager votre expérience de ce lieu !</p>
      </div>

      <!-- Reviews List -->
      <div class="space-y-4">
        <div *ngFor="let a of avis" class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full border-2 border-white shadow-sm bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-600 font-bold">
                {{ getInitials(a.auteurPrenom, a.auteurNom) }}
              </div>
              <div>
                <h4 class="font-semibold text-gray-900">{{ a.auteurPrenom }} {{ a.auteurNom }}</h4>
                <p class="text-xs text-gray-500">{{ a.createdAt | date:'dd/MM/yyyy' }}</p>
              </div>
            </div>
            
            <!-- Stars Display -->
            <div class="flex items-center">
              <svg *ngFor="let star of [1, 2, 3, 4, 5]" class="w-4 h-4" [ngClass]="star <= a.note ? 'text-yellow-400' : 'text-gray-200'" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </div>
          </div>
          <p class="text-gray-600 leading-relaxed font-light" *ngIf="a.commentaire">{{ a.commentaire }}</p>
        </div>
      </div>
    </div>
  `
})
export class AvisList implements OnInit {
  @Input() lieuId!: number;

  avis: Avis[] = [];
  loading = false;
  error: string | null = null;

  isLoggedIn = false;

  // Form handling
  hoverRating = 0;
  submitting = false;
  newAvis = {
    note: 0,
    commentaire: ''
  };

  constructor(
    private avisService: AvisService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    if (this.lieuId) {
      this.loadAvis();
    }
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  loadAvis(): void {
    this.loading = true;
    this.error = null;

    this.avisService.findByLieu(this.lieuId).subscribe({
      next: (data: Avis[]) => {
        this.avis = data;
        this.loading = false;
      },
      error: (err: unknown) => {
        console.error('Erreur lors du chargement des avis', err);
        // Silently fail or show simple message, not breaking the detail page
        this.error = "Impossible de charger les avis.";
        this.loading = false;
      }
    });
  }

  submitAvis(): void {
    if (!this.newAvis.note) return;

    this.submitting = true;
    this.avisService.create(this.lieuId, this.newAvis).subscribe({
      next: (newAvisItem: Avis) => {
        this.avis.unshift(newAvisItem); // Add to top
        this.newAvis = { note: 0, commentaire: '' }; // Reset form
        this.hoverRating = 0;
        this.submitting = false;
      },
      error: (err: unknown) => {
        console.error("Erreur lors de l'ajout", err);
        this.error = "Une erreur est survenue lors de l'envoi de votre avis.";
        this.submitting = false;
        this.cdr.detectChanges();
      }
    });
  }

  getInitials(prenom: string, nom: string): string {
    return `${(prenom || '').charAt(0)}${(nom || '').charAt(0)}`.toUpperCase();
  }
}
