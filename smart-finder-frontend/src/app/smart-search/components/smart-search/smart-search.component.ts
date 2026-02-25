import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment';

interface SmartSearchResult {
  id: number;
  nom: string;
  description: string;
  adresse: string;
  noteMoyenne: number;
}

interface SmartSearchResponse {
  results: SmartSearchResult[];
  extractedCriteria: Record<string, any>;
  interpretedQuery: string;
  totalResults: number;
  searchId: string;
}

@Component({
  selector: 'app-smart-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <!-- Header -->
      <div class="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div class="max-w-4xl mx-auto px-4 py-8">
          <h1 class="text-2xl md:text-3xl font-bold mb-2">Concierge Virtuel</h1>
          <p class="text-primary-100">Décrivez votre besoin, notre IA trouve l'espace parfait</p>
        </div>
      </div>

      <div class="max-w-4xl mx-auto px-4 -mt-4">
        <!-- Search Input -->
        <div class="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div class="relative">
            <textarea
              [(ngModel)]="userQuery"
              placeholder="Ex: Je cherche un espace calme avec fibre optique et parking, près de la gare pour 5 personnes..."
              class="w-full p-4 pr-12 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows="3"
              (keydown.enter)="!$event.shiftKey && onSearch()"
            ></textarea>
            <button
              (click)="onSearch()"
              [disabled]="isLoading || !userQuery.trim()"
              class="absolute right-2 bottom-2 p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </button>
          </div>
          
          <!-- Suggestions -->
          <div class="mt-3 flex flex-wrap gap-2">
            <span class="text-xs text-gray-500">Exemples:</span>
            <button 
              *ngFor="let example of examples"
              (click)="useExample(example)"
              class="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded transition-colors"
            >
              {{ example }}
            </button>
          </div>
        </div>

        <!-- Loading -->
        <div *ngIf="isLoading" class="text-center py-12">
          <div class="inline-flex items-center space-x-2">
            <div class="w-3 h-3 bg-primary-600 rounded-full animate-bounce"></div>
            <div class="w-3 h-3 bg-primary-600 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
            <div class="w-3 h-3 bg-primary-600 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
          </div>
          <p class="mt-4 text-gray-600">L'IA analyse votre demande...</p>
        </div>

        <!-- Error -->
        <div *ngIf="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p class="text-red-600">{{ error }}</p>
        </div>

        <!-- Results -->
        <div *ngIf="response && !isLoading">
          <!-- Interpreted Query -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p class="text-sm text-blue-800">
              <span class="font-medium">Interprétation:</span> {{ response.interpretedQuery }}
            </p>
          </div>

          <!-- Extracted Criteria -->
          <div *ngIf="response.extractedCriteria && Object.keys(response.extractedCriteria).length > 0" class="mb-6">
            <h3 class="text-sm font-medium text-gray-700 mb-2">Critères identifiés:</h3>
            <div class="flex flex-wrap gap-2">
              <span 
                *ngFor="let criteria of getCriteriaList(response.extractedCriteria)"
                class="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm"
              >
                {{ criteria }}
              </span>
            </div>
          </div>

          <!-- Results Count -->
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-900">
              {{ response.totalResults }} espace(s) trouvé(s)
            </h2>
          </div>

          <!-- Results Grid -->
          <div class="grid gap-4">
            <div 
              *ngFor="let lieu of response.results"
              [routerLink]="['/lieux', lieu.id]"
              class="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4 cursor-pointer"
            >
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="font-semibold text-gray-900">{{ lieu.nom }}</h3>
                  <p class="text-sm text-gray-600 mt-1">{{ lieu.adresse }}</p>
                  <p class="text-sm text-gray-500 mt-2 line-clamp-2">{{ lieu.description }}</p>
                </div>
                <div *ngIf="lieu.noteMoyenne" class="flex items-center bg-yellow-50 px-2 py-1 rounded">
                  <svg class="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <span class="text-sm font-medium">{{ lieu.noteMoyenne | number:'1.1-1' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- No Results -->
          <div *ngIf="response.results.length === 0" class="text-center py-12">
            <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p class="text-gray-500">Aucun espace ne correspond à votre recherche</p>
            <p class="text-sm text-gray-400 mt-2">Essayez avec d'autres critères</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SmartSearchComponent {
  userQuery = '';
  isLoading = false;
  error: string | null = null;
  response: SmartSearchResponse | null = null;

  examples = [
    'Espace calme avec fibre pour développeur',
    'Coworking familial avec parking',
    'Salle créative avec tableau blanc et projecteur'
  ];

  // Expose Object for template
  Object = Object;

  constructor(private http: HttpClient) {}

  onSearch(): void {
    if (!this.userQuery.trim()) return;

    this.isLoading = true;
    this.error = null;

    const request = {
      userQuery: this.userQuery,
      latitude: null,
      longitude: null,
      radiusKm: 10.0
    };

    this.http.post<SmartSearchResponse>(`${environment.apiUrl}/smart-search`, request)
      .subscribe({
        next: (response) => {
          this.response = response;
          this.isLoading = false;
        },
        error: (err) => {
          this.error = err.error?.message || 'Erreur lors de la recherche. Veuillez réessayer.';
          this.isLoading = false;
        }
      });
  }

  useExample(example: string): void {
    this.userQuery = example;
  }

  getCriteriaList(criteria: Record<string, any>): string[] {
    const list: string[] = [];
    for (const [key, value] of Object.entries(criteria)) {
      if (value && value !== 'fallback' && value !== 'error') {
        if (Array.isArray(value) && value.length > 0) {
          list.push(`${key}: ${value.join(', ')}`);
        } else if (!Array.isArray(value)) {
          list.push(`${key}: ${value}`);
        }
      }
    }
    return list;
  }
}
