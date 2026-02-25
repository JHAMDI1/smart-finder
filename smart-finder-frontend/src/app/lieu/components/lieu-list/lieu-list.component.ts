import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LieuService } from '../services/lieu.service';
import { Lieu, SearchRequest } from '../models/lieu.model';

@Component({
  selector: 'app-lieu-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 pb-20">
      <!-- Header -->
      <header class="bg-primary-600 text-white p-4 sticky top-0 z-10">
        <h1 class="text-xl font-bold">Smart Finder</h1>
        <p class="text-sm opacity-90">Trouvez votre espace de travail idéal</p>
      </header>

      <!-- Search Bar -->
      <div class="p-4 bg-white shadow-sm">
        <div class="relative">
          <input
            type="text"
            placeholder="Rechercher un lieu..."
            class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
            (input)="onSearch($event)"
          />
          <svg class="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
      </div>

      <!-- Filters -->
      <div class="px-4 py-2 bg-white border-b">
        <div class="flex gap-2 overflow-x-auto pb-2">
          <button
            *ngFor="let critere of criteres"
            (click)="toggleCritere(critere.id)"
            [class.bg-primary-600]="selectedCriteres.has(critere.id)"
            [class.text-white]="selectedCriteres.has(critere.id)"
            [class.bg-gray-100]="!selectedCriteres.has(critere.id)"
            [class.text-gray-700]="!selectedCriteres.has(critere.id)"
            class="px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors"
          >
            {{ critere.nom }}
          </button>
        </div>
      </div>

      <!-- Results Count -->
      <div class="px-4 py-2 text-sm text-gray-600">
        {{ lieux.length }} lieu{{ lieux.length > 1 ? 'x' : '' }} trouvé{{ lieux.length > 1 ? 's' : '' }}
      </div>

      <!-- Lieux List -->
      <div class="px-4 space-y-4">
        <div
          *ngFor="let lieu of lieux"
          class="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
          (click)="onSelectLieu(lieu)"
        >
          <!-- Image Placeholder -->
          <div class="h-40 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
            <svg class="w-16 h-16 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
          </div>

          <!-- Content -->
          <div class="p-4">
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-bold text-lg text-gray-900">{{ lieu.nom }}</h3>
              <div class="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded">
                <svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <span class="text-sm font-medium text-yellow-700">{{ lieu.noteMoyenne | number:'1.1' }}</span>
              </div>
            </div>

            <p class="text-gray-600 text-sm mb-3">{{ lieu.adresse }}</p>

            <!-- Criteres -->
            <div class="flex flex-wrap gap-2" *ngIf="lieu.criteres?.length">
              <span
                *ngFor="let c of lieu.criteres | slice:0:3"
                class="text-xs px-2 py-1 bg-primary-50 text-primary-700 rounded"
              >
                {{ c.nom }}
              </span>
              <span *ngIf="(lieu.criteres?.length || 0) > 3" class="text-xs text-gray-500">
                +{{ (lieu.criteres?.length || 0) - 3 }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    </div>
  `
})
export class LieuListComponent implements OnInit {
  lieux: Lieu[] = [];
  criteres = [
    { id: 1, nom: 'Wi-Fi' },
    { id: 2, nom: 'Prises' },
    { id: 3, nom: 'Calme' },
    { id: 4, nom: 'Terrasse' },
    { id: 5, nom: 'Parking' },
    { id: 6, nom: 'Vegan' }
  ];
  selectedCriteres = new Set<number>();
  loading = false;
  searchQuery = '';

  constructor(private lieuService: LieuService) {}

  ngOnInit(): void {
    this.loadLieux();
  }

  loadLieux(): void {
    this.loading = true;
    const request: SearchRequest = {
      critereIds: Array.from(this.selectedCriteres),
      search: this.searchQuery || undefined,
      page: 0,
      size: 20
    };

    this.lieuService.search(request).subscribe({
      next: (response) => {
        this.lieux = response.content;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading lieux:', err);
        this.loading = false;
      }
    });
  }

  toggleCritere(id: number): void {
    if (this.selectedCriteres.has(id)) {
      this.selectedCriteres.delete(id);
    } else {
      this.selectedCriteres.add(id);
    }
    this.loadLieux();
  }

  onSearch(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement).value;
    this.loadLieux();
  }

  onSelectLieu(lieu: Lieu): void {
    console.log('Selected lieu:', lieu);
    // Navigation to detail page will be implemented later
  }
}
