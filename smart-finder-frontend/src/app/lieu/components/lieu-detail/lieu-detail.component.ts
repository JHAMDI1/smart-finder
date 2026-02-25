import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LieuService } from '../../services/lieu.service';
import { Lieu } from '../../models/lieu.model';

@Component({
  selector: 'app-lieu-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 pb-20">
      <!-- Header with Back Button -->
      <header class="bg-white shadow-sm sticky top-0 z-10">
        <div class="flex items-center p-4">
          <button
            (click)="goBack()"
            class="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1 class="ml-2 text-lg font-semibold text-gray-900 truncate">{{ lieu?.nom || 'Détails' }}</h1>
        </div>
      </header>

      <!-- Loading State -->
      <div *ngIf="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>

      <!-- Error State -->
      <div *ngIf="error" class="p-4">
        <div class="bg-red-50 text-red-600 p-4 rounded-lg text-center">
          {{ error }}
        </div>
      </div>

      <!-- Content -->
      <div *ngIf="lieu && !loading" class="pb-8">
        <!-- Hero Image -->
        <div class="h-56 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
          <svg class="w-24 h-24 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
        </div>

        <!-- Info Card -->
        <div class="px-4 -mt-6">
          <div class="bg-white rounded-xl shadow-sm p-5">
            <!-- Title & Rating -->
            <div class="flex justify-between items-start mb-3">
              <h2 class="text-xl font-bold text-gray-900">{{ lieu.nom }}</h2>
              <div class="flex items-center gap-1 bg-yellow-100 px-3 py-1.5 rounded-full">
                <svg class="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <span class="font-semibold text-yellow-700">{{ lieu.noteMoyenne | number:'1.1' }}</span>
              </div>
            </div>

            <!-- Address -->
            <p class="text-gray-600 mb-4 flex items-start gap-2">
              <svg class="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <span>{{ lieu.adresse }}</span>
            </p>

            <!-- Horaires -->
            <div *ngIf="lieu.horaires" class="mb-4 p-3 bg-gray-50 rounded-lg">
              <p class="text-sm text-gray-600 flex items-center gap-2">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                {{ lieu.horaires }}
              </p>
            </div>

            <!-- Description -->
            <div *ngIf="lieu.description" class="mb-4">
              <h3 class="font-semibold text-gray-900 mb-2">Description</h3>
              <p class="text-gray-600 text-sm leading-relaxed">{{ lieu.description }}</p>
            </div>

            <!-- Criteres -->
            <div *ngIf="lieu.criteres?.length">
              <h3 class="font-semibold text-gray-900 mb-2">Équipements & Services</h3>
              <div class="flex flex-wrap gap-2">
                <span
                  *ngFor="let c of lieu.criteres"
                  class="text-sm px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full"
                >
                  {{ c.nom }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="px-4 mt-6 space-y-3">
          <button class="w-full bg-primary-600 text-white py-3.5 rounded-xl font-medium hover:bg-primary-700 transition-colors flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
            </svg>
            Donner mon avis
          </button>

          <button class="w-full bg-white border-2 border-gray-200 text-gray-700 py-3.5 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            Voir sur la carte
          </button>
        </div>
      </div>
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
    private lieuService: LieuService
  ) {}

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
      },
      error: (err: unknown) => {
        this.error = (err as { error?: { message?: string } })?.error?.message || 'Erreur lors du chargement';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/lieux']);
  }
}
