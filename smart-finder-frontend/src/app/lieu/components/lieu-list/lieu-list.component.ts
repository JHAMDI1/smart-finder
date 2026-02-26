import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LieuService } from '../../services/lieu.service';
import { CritereService } from '../../../critere/services/critere.service';
import { Lieu, SearchRequest, SearchResponse } from '../../models/lieu.model';
import { Critere } from '../../../critere/models/critere.model';

interface CategorieGroup {
  nom: string;
  label: string;
  icon: string;
  criteres: Critere[];
  open: boolean;
}

@Component({
  selector: 'app-lieu-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 pb-24 md:pb-12 pt-20">
      
      <!-- Hero Header -->
      <div class="relative bg-gray-900 overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-primary-900 via-gray-900 to-indigo-900 opacity-90"></div>
        
        <!-- Decorative blobs -->
        <div class="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-primary-500 blur-[80px] opacity-40 mix-blend-screen"></div>
        <div class="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-indigo-500 blur-[100px] opacity-30 mix-blend-screen"></div>

        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <h1 class="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Trouvez l'espace idéal pour <span class="bg-gradient-to-r from-primary-400 to-indigo-400 bg-clip-text text-transparent">travailler</span>
          </h1>
          <p class="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 font-light">
            Découvrez les meilleurs cafés, espaces de coworking et bibliothèques adaptés à vos besoins.
          </p>

          <!-- Search Bar -->
          <div class="max-w-2xl mx-auto relative group">
            <div class="absolute inset-0 bg-gradient-to-r from-primary-500 to-indigo-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
            <div class="relative bg-white/10 backdrop-blur-md rounded-2xl p-2 flex items-center border border-white/20 shadow-2xl">
              <svg class="w-6 h-6 text-gray-400 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                type="text"
                [(ngModel)]="searchQuery"
                (keyup.enter)="loadLieux()"
                placeholder="Ex: Café calme avec Wi-Fi..."
                class="w-full bg-transparent border-none text-white placeholder-gray-400 px-4 py-3 focus:outline-none focus:ring-0 text-lg"
              />
              <button 
                (click)="loadLieux()"
                class="bg-white text-gray-900 hover:bg-gray-50 px-6 py-3 rounded-xl font-semibold transition-colors shadow-sm"
              >
                Chercher
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <!-- Filters Card -->
        <div class="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <!-- Header (clickable on mobile) -->
          <button 
            (click)="filtersOpen = !filtersOpen" 
            class="w-full flex items-center justify-between p-5 md:p-6 text-left"
          >
            <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2">
              <svg class="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
              </svg>
              Filtrer par critères
              <span *ngIf="selectedCriteres.size > 0" class="bg-primary-100 text-primary-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {{ selectedCriteres.size }} actif(s)
              </span>
            </h2>
            <div class="flex items-center gap-3">
              <div class="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {{ totalResults }} résultat(s)
              </div>
              <svg 
                class="w-5 h-5 text-gray-400 transition-transform md:hidden" 
                [class.rotate-180]="filtersOpen"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
          </button>
          
          <!-- Filter Body -->
          <div 
            class="px-5 md:px-6 overflow-hidden transition-all duration-300"
            [class.max-h-0]="!filtersOpen && isMobile()"
            [class.pb-0]="!filtersOpen && isMobile()"
            [class.max-h-[1000px]]="filtersOpen || !isMobile()"
            [class.pb-6]="filtersOpen || !isMobile()"
          >
            <!-- Category Groups -->
            <div class="space-y-4">
              <div *ngFor="let group of categorieGroups" class="border border-gray-100 rounded-xl overflow-hidden">
                <!-- Category Header -->
                <button 
                  (click)="group.open = !group.open"
                  class="w-full flex items-center justify-between px-4 py-3 bg-gray-50/50 hover:bg-gray-50 transition-colors text-left"
                >
                  <div class="flex items-center gap-2">
                    <span class="text-lg">{{ group.icon }}</span>
                    <span class="text-sm font-semibold text-gray-700">{{ group.label }}</span>
                    <span class="text-xs text-gray-400">({{ group.criteres.length }})</span>
                    <span 
                      *ngIf="countSelectedInGroup(group) > 0" 
                      class="w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
                    >
                      {{ countSelectedInGroup(group) }}
                    </span>
                  </div>
                  <svg 
                    class="w-4 h-4 text-gray-400 transition-transform" 
                    [class.rotate-180]="group.open"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
                
                <!-- Critères in group -->
                <div *ngIf="group.open" class="p-3 flex flex-wrap gap-2">
                  <button
                    *ngFor="let critere of group.criteres"
                    (click)="toggleCritere(critere.id)"
                    [class.bg-primary-600]="selectedCriteres.has(critere.id)"
                    [class.text-white]="selectedCriteres.has(critere.id)"
                    [class.border-primary-600]="selectedCriteres.has(critere.id)"
                    [class.shadow-primary-200]="selectedCriteres.has(critere.id)"
                    [class.bg-white]="!selectedCriteres.has(critere.id)"
                    [class.text-gray-700]="!selectedCriteres.has(critere.id)"
                    [class.border-gray-200]="!selectedCriteres.has(critere.id)"
                    class="px-3.5 py-2 rounded-lg text-sm font-medium border hover:border-primary-400 transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <span *ngIf="critere.icon">{{ critere.icon }}</span>
                    {{ critere.nom }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Reset -->
            <div *ngIf="selectedCriteres.size > 0" class="mt-4 flex justify-end">
              <button 
                (click)="clearFilters()" 
                class="text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-1 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
                Réinitialiser les filtres
              </button>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="flex flex-col items-center justify-center py-20">
          <div class="relative w-16 h-16">
            <div class="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
            <div class="absolute inset-0 border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p class="mt-4 text-gray-500 font-medium">Recherche des meilleurs lieux...</p>
        </div>

        <!-- Lieux Grid -->
        <div *ngIf="!loading && lieux.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          <a
            *ngFor="let lieu of lieux"
            [routerLink]="['/lieux', lieu.id]"
            class="group bg-white rounded-2xl shadow-sm hover:shadow-2xl hover:shadow-primary-500/10 border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
          >
            <!-- Image Area -->
            <div class="h-48 relative overflow-hidden bg-gray-100">
              <div class="absolute inset-0 bg-gradient-to-br from-primary-400/20 to-indigo-500/20 group-hover:scale-105 transition-transform duration-500"></div>
              
              <svg class="absolute inset-0 w-full h-full text-gray-200" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none">
                 <pattern id="grid-pattern-{{lieu.id}}" width="20" height="20" patternUnits="userSpaceOnUse">
                   <circle cx="2" cy="2" r="1.5" />
                 </pattern>
                 <rect width="100%" height="100%" [attr.fill]="'url(#grid-pattern-' + lieu.id + ')'" />
              </svg>

              <div class="absolute inset-0 flex items-center justify-center">
                 <div class="w-16 h-16 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform">
                   <svg class="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                   </svg>
                 </div>
              </div>

              <!-- Rating Badge -->
              <div class="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                <svg class="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <span class="font-bold text-gray-900">{{ lieu.noteMoyenne | number:'1.1-1' }}</span>
              </div>
            </div>

            <!-- Content -->
            <div class="p-6 flex flex-col flex-grow">
              <h3 class="font-bold text-xl text-gray-900 group-hover:text-primary-600 transition-colors mb-2 line-clamp-1">
                {{ lieu.nom }}
              </h3>
              
              <div class="flex items-start gap-2 mb-4 text-gray-500">
                <svg class="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <p class="text-sm line-clamp-2">{{ lieu.adresse }}</p>
              </div>

              <p class="text-sm text-gray-600 line-clamp-2 mb-6 flex-grow">
                {{ lieu.description }}
              </p>

              <!-- Tags -->
              <div class="flex flex-wrap gap-2 mt-auto pt-4 border-t border-gray-100">
                <span
                  *ngFor="let c of lieu.criteres | slice:0:3"
                  class="text-xs font-semibold px-2.5 py-1 bg-primary-50 text-primary-700 rounded-md border border-primary-100"
                >
                  {{ c.icon ? c.icon + ' ' : '' }}{{ c.nom }}
                </span>
                <span *ngIf="(lieu.criteres?.length || 0) > 3" class="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-md">
                  +{{ (lieu.criteres?.length || 0) - 3 }}
                </span>
              </div>
            </div>
          </a>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading && lieux.length === 0" class="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 mt-10">
          <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Aucun lieu trouvé</h3>
          <p class="text-gray-500 max-w-sm mx-auto">
            Nous n'avons pas trouvé de lieux correspondant à vos critères. Essayez de modifier votre recherche.
          </p>
          <button (click)="clearFilters()" class="mt-6 text-primary-600 font-semibold hover:text-primary-700 hover:underline">
            Réinitialiser les filtres
          </button>
        </div>

      </div>
    </div>
  `
})
export class LieuListComponent implements OnInit {
  lieux: Lieu[] = [];
  criteres: Critere[] = [];
  categorieGroups: CategorieGroup[] = [];
  selectedCriteres = new Set<number>();
  loading = false;
  searchQuery = '';
  totalResults = 0;
  filtersOpen = true;

  private categorieLabels: Record<string, { label: string; icon: string }> = {
    'CONNECTIVITE': { label: 'Connectivité', icon: '📶' },
    'AMBIANCE': { label: 'Ambiance', icon: '✨' },
    'CONFORT': { label: 'Confort', icon: '🪑' },
    'SERVICES': { label: 'Services', icon: '☕' },
    'HORAIRES': { label: 'Horaires', icon: '🕐' },
    'RESTAURATION': { label: 'Restauration', icon: '🍽️' },
    'ACCESSIBILITE': { label: 'Accessibilité', icon: '♿' },
  };

  constructor(
    private lieuService: LieuService,
    private critereService: CritereService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadCriteres();
    this.loadLieux();
  }

  isMobile(): boolean {
    return typeof window !== 'undefined' && window.innerWidth < 768;
  }

  loadCriteres(): void {
    this.critereService.findAll().subscribe({
      next: (criteres) => {
        this.criteres = criteres;
        this.buildCategorieGroups();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erreur chargement critères:', err)
    });
  }

  buildCategorieGroups(): void {
    const grouped = new Map<string, Critere[]>();
    for (const c of this.criteres) {
      const cat = c.categorie || 'AUTRE';
      if (!grouped.has(cat)) {
        grouped.set(cat, []);
      }
      grouped.get(cat)!.push(c);
    }

    this.categorieGroups = Array.from(grouped.entries()).map(([key, criteres]) => {
      const meta = this.categorieLabels[key] || { label: key, icon: '📌' };
      return {
        nom: key,
        label: meta.label,
        icon: meta.icon,
        criteres,
        open: true
      };
    });
  }

  countSelectedInGroup(group: CategorieGroup): number {
    return group.criteres.filter(c => this.selectedCriteres.has(c.id)).length;
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
      next: (response: SearchResponse) => {
        this.lieux = response.content;
        this.totalResults = response.totalElements;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: unknown) => {
        console.error('Error loading lieux:', err);
        this.loading = false;
        this.cdr.detectChanges();
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

  clearFilters(): void {
    this.selectedCriteres.clear();
    this.searchQuery = '';
    this.loadLieux();
  }
}

