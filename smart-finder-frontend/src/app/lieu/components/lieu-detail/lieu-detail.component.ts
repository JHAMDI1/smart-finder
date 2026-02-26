import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LieuService } from '../../services/lieu.service';
import { Lieu } from '../../models/lieu.model';
import { AvisList } from '../../../avis/avis/components/avis-list/avis-list';

@Component({
  selector: 'app-lieu-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, AvisList],
  template: `
    <div class="min-h-screen bg-gray-50 pb-24 md:pb-12">
      
      <!-- Loading State -->
      <div *ngIf="loading" class="min-h-screen flex flex-col items-center justify-center pt-20">
        <div class="relative w-16 h-16">
          <div class="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
          <div class="absolute inset-0 border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p class="mt-4 text-gray-500 font-medium">Chargement des détails...</p>
      </div>

      <!-- Error State -->
      <div *ngIf="error" class="min-h-screen flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-gray-100">
          <div class="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <h2 class="text-xl font-bold text-gray-900 mb-2">Erreur</h2>
          <p class="text-gray-600 mb-6">{{ error }}</p>
          <button (click)="goBack()" class="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors">
            Retour à la liste
          </button>
        </div>
      </div>

      <!-- Content -->
      <ng-container *ngIf="lieu && !loading">
        <!-- Hero Section with Parallax effect -->
        <div class="relative h-[40vh] md:h-[50vh] bg-gray-900 overflow-hidden isolate">
          <!-- Back Button (Floating) -->
          <button (click)="goBack()" class="absolute top-6 left-4 md:left-8 z-20 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all hover:-translate-x-1 outline-none">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>

          <!-- Dynamic BG Gradient or Image -->
          <div *ngIf="lieu.imageUrl" class="absolute inset-0 bg-cover bg-center" [style.backgroundImage]="'url(' + lieu.imageUrl + ')'"></div>
          <div *ngIf="!lieu.imageUrl" class="absolute inset-0 bg-gradient-to-br from-indigo-900 via-primary-900 to-primary-800"></div>
          
          <!-- Decorative Patterns OVERLAY (always dark overlay to read text) -->
          <div class="absolute inset-0 bg-gray-900/60" *ngIf="lieu.imageUrl"></div>
          <svg *ngIf="!lieu.imageUrl" class="absolute inset-0 w-full h-full text-white/5 mix-blend-overlay" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="grid-detail" width="10" height="10" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid-detail)" />
          </svg>

          <!-- Bottom Gradient for smooth transition -->
          <div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent z-10"></div>
          
          <!-- Title Content inside Hero -->
          <div class="absolute bottom-10 left-0 right-0 z-20 px-4 md:px-8 max-w-7xl mx-auto">
            <div class="flex items-center gap-3 mb-3">
              <span class="px-3 py-1 bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-full text-xs font-semibold tracking-wider uppercase shadow-lg">Espace</span>
              <div class="flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-amber-950 rounded-full text-xs font-extrabold shadow-lg">
                <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                {{ lieu.noteMoyenne | number:'1.1-1' }}
              </div>
            </div>
            <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-md mb-2 tracking-tight">{{ lieu.nom }}</h1>
            <p class="text-white/80 text-base md:text-xl flex items-center gap-2 max-w-2xl drop-shadow-sm">
              <svg class="w-5 h-5 opacity-70 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              {{ lieu.adresse }}
            </p>
          </div>
        </div>

        <!-- Main Content Area -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2 relative z-20">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <!-- Left Column (Details) -->
            <div class="lg:col-span-2 space-y-8">
              
              <!-- Description Card -->
              <div class="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
                <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg class="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  À propos de ce lieu
                </h3>
                <p class="text-gray-600 leading-relaxed text-lg font-light">{{ lieu.description || 'Aucune description fournie pour ce lieu.' }}</p>
              </div>

              <!-- Criteres/Equipements Card -->
              <div class="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100" *ngIf="lieu.criteres?.length">
                <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <svg class="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                  </svg>
                  Équipements & Services offerts
                </h3>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div *ngFor="let c of lieu.criteres" class="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100 hover:border-primary-200 hover:bg-primary-50 transition-colors">
                    <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-primary-600">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <span class="font-medium text-gray-800">{{ c.nom }}</span>
                  </div>
                </div>
              </div>

              <!-- Avis Section -->
              <app-avis-list *ngIf="lieu" [lieuId]="lieu.id"></app-avis-list>

            </div>

            <!-- Right Column (Sticky Sidebar) -->
            <div class="space-y-6">
              <div class="sticky top-24">
                
                <!-- Action / Info Card -->
                <div class="bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100 mb-6 relative overflow-hidden">
                  <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-500 to-indigo-500"></div>
                  
                  <!-- Horaires (if available) -->
                  <div *ngIf="lieu.horaires" class="mb-6 pb-6 border-b border-gray-100">
                    <h4 class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Horaires</h4>
                    <div class="flex items-start gap-4 p-4 rounded-2xl bg-primary-50/50 text-primary-900 border border-primary-100/50">
                      <svg class="w-6 h-6 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      <span class="font-medium leading-relaxed">{{ lieu.horaires }}</span>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="space-y-4">
                    <button class="w-full bg-gray-900 text-white shadow-lg shadow-gray-900/20 py-4 rounded-2xl font-bold hover:bg-gray-800 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                      </svg>
                      Donner mon avis
                    </button>
                    
                    <button class="w-full bg-white border-2 border-gray-200 text-gray-800 py-4 rounded-2xl font-bold hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-3">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                      </svg>
                      Ouvrir la carte
                    </button>
                  </div>
                </div>

                <!-- Small Promo Card -->
                <div class="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
                  <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                  <h4 class="font-bold text-lg mb-2 relative z-10">Vous gérez ce lieu ?</h4>
                  <p class="text-indigo-100 text-sm mb-4 relative z-10">Prenez le contrôle de votre fiche et gagnez en visibilité.</p>
                  <a routerLink="/register" class="inline-block px-4 py-2 bg-white text-indigo-600 rounded-xl font-bold text-sm hover:shadow-md transition-shadow relative z-10">Revendiquer</a>
                </div>

              </div>
            </div>
          </div>
        </div>
      </ng-container>
    </div>
  `
})
export class LieuDetailComponent implements OnInit {
  lieu: Lieu | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private lieuService: LieuService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadLieu(+id);
    } else {
      this.error = 'ID du lieu non trouvé';
    }
  }

  loadLieu(id: number): void {
    this.loading = true;
    this.error = null;

    this.lieuService.findById(id).subscribe({
      next: (lieu: Lieu) => {
        this.lieu = lieu;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: unknown) => {
        this.error = (err as { error?: { message?: string } })?.error?.message || 'Erreur lors du chargement des informations du lieu.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/lieux']);
  }
}
