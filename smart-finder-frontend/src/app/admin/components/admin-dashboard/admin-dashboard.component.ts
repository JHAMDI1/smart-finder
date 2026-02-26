import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CritereService } from '../../../critere/services/critere.service';
import { Critere } from '../../../critere/models/critere.model';
import { LieuService } from '../../../lieu/services/lieu.service';
import { Lieu } from '../../../lieu/models/lieu.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface AvisAdmin {
  id: number;
  note: number;
  commentaire: string;
  utilisateurNom?: string;
  lieuNom?: string;
  createdAt?: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50 pt-24 pb-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <span class="bg-gradient-to-br from-primary-500 to-indigo-600 text-white w-12 h-12 rounded-xl flex items-center justify-center shadow-lg">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </span>
            Dashboard Administrateur
          </h1>
          <p class="text-gray-500 mt-2 ml-15">Gérez les critères, modérez les avis et supervisez la plateforme</p>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div class="flex items-center gap-4">
              <div class="bg-primary-50 w-12 h-12 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              </div>
              <div>
                <p class="text-sm text-gray-500">Lieux</p>
                <p class="text-2xl font-bold text-gray-900">{{ statsLieux }}</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div class="flex items-center gap-4">
              <div class="bg-indigo-50 w-12 h-12 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                </svg>
              </div>
              <div>
                <p class="text-sm text-gray-500">Critères</p>
                <p class="text-2xl font-bold text-gray-900">{{ criteres.length }}</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div class="flex items-center gap-4">
              <div class="bg-amber-50 w-12 h-12 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                </svg>
              </div>
              <div>
                <p class="text-sm text-gray-500">Avis</p>
                <p class="text-2xl font-bold text-gray-900">{{ statsAvis }}</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div class="flex items-center gap-4">
              <div class="bg-emerald-50 w-12 h-12 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
              </div>
              <div>
                <p class="text-sm text-gray-500">Utilisateurs</p>
                <p class="text-2xl font-bold text-gray-900">{{ statsUsers }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="mb-6 flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
          <button 
            *ngFor="let tab of tabs"
            (click)="activeTab = tab.key"
            [class.bg-white]="activeTab === tab.key"
            [class.shadow-sm]="activeTab === tab.key"
            [class.text-gray-900]="activeTab === tab.key"
            [class.font-semibold]="activeTab === tab.key"
            [class.text-gray-500]="activeTab !== tab.key"
            class="px-5 py-2.5 rounded-lg text-sm transition-all"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- ==================== TAB: CRITÈRES ==================== -->
        <div *ngIf="activeTab === 'criteres'" class="space-y-6">
          <!-- Add Critère Form -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 class="font-bold text-lg text-gray-900 mb-4">{{ editingCritere ? 'Modifier le critère' : 'Ajouter un critère' }}</h3>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input 
                [(ngModel)]="newCritere.nom"
                placeholder="Nom du critère"
                class="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
              <select 
                [(ngModel)]="newCritere.categorie"
                class="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              >
                <option value="">Catégorie...</option>
                <option value="CONNECTIVITE">Connectivité</option>
                <option value="AMBIANCE">Ambiance</option>
                <option value="CONFORT">Confort</option>
                <option value="SERVICES">Services</option>
                <option value="HORAIRES">Horaires</option>
                <option value="RESTAURATION">Restauration</option>
                <option value="ACCESSIBILITE">Accessibilité</option>
              </select>
              <input 
                [(ngModel)]="newCritere.icon"
                placeholder="Icône (emoji)"
                class="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
              <div class="flex gap-2">
                <button 
                  (click)="saveCritere()"
                  [disabled]="!newCritere.nom || !newCritere.categorie"
                  class="flex-1 bg-primary-600 hover:bg-primary-700 disabled:opacity-40 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
                >
                  {{ editingCritere ? 'Modifier' : 'Ajouter' }}
                </button>
                <button 
                  *ngIf="editingCritere"
                  (click)="cancelEdit()"
                  class="px-4 py-2.5 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>

          <!-- Critères List -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th class="text-left py-3.5 px-6 text-sm font-semibold text-gray-600">Critère</th>
                  <th class="text-left py-3.5 px-6 text-sm font-semibold text-gray-600 hidden md:table-cell">Catégorie</th>
                  <th class="text-left py-3.5 px-6 text-sm font-semibold text-gray-600 hidden md:table-cell">Icône</th>
                  <th class="text-right py-3.5 px-6 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                <tr *ngFor="let critere of criteres" class="hover:bg-gray-50/50 transition-colors">
                  <td class="py-3.5 px-6">
                    <span class="font-medium text-gray-900">{{ critere.nom }}</span>
                    <span class="md:hidden text-xs text-gray-400 ml-2">{{ critere.categorie }}</span>
                  </td>
                  <td class="py-3.5 px-6 hidden md:table-cell">
                    <span class="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">{{ critere.categorie }}</span>
                  </td>
                  <td class="py-3.5 px-6 text-lg hidden md:table-cell">{{ critere.icon || '—' }}</td>
                  <td class="py-3.5 px-6 text-right">
                    <button (click)="editCritere(critere)" class="text-primary-600 hover:text-primary-800 font-medium text-sm mr-3">Modifier</button>
                    <button (click)="deleteCritere(critere.id)" class="text-red-500 hover:text-red-700 font-medium text-sm">Supprimer</button>
                  </td>
                </tr>
                <tr *ngIf="criteres.length === 0">
                  <td colspan="4" class="py-12 text-center text-gray-400">Aucun critère pour le moment.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- ==================== TAB: AVIS ==================== -->
        <div *ngIf="activeTab === 'avis'" class="space-y-6">
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="p-6 border-b border-gray-100">
              <h3 class="font-bold text-lg text-gray-900">Modération des avis</h3>
              <p class="text-sm text-gray-500 mt-1">Supprimez les avis inappropriés ou offensants</p>
            </div>
            <div class="divide-y divide-gray-50">
              <div *ngFor="let avis of avisList" class="p-6 hover:bg-gray-50/50 transition-colors">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <div class="flex text-amber-400">
                        <svg *ngFor="let s of [1,2,3,4,5]" class="w-4 h-4" [class.text-gray-200]="s > avis.note" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      </div>
                      <span class="text-sm font-medium text-gray-900">{{ avis.utilisateurNom || 'Anonyme' }}</span>
                      <span class="text-xs text-gray-400">sur <strong>{{ avis.lieuNom || 'Lieu #' + avis.id }}</strong></span>
                    </div>
                    <p class="text-sm text-gray-600">{{ avis.commentaire || 'Pas de commentaire' }}</p>
                  </div>
                  <button 
                    (click)="deleteAvis(avis.id)" 
                    class="ml-4 text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors shrink-0"
                    title="Supprimer cet avis"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div *ngIf="avisList.length === 0" class="p-12 text-center text-gray-400">
                Aucun avis à modérer.
              </div>
            </div>
          </div>
        </div>

        <!-- ==================== TAB: LIEUX ==================== -->
        <div *ngIf="activeTab === 'lieux'" class="space-y-6">
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th class="text-left py-3.5 px-6 text-sm font-semibold text-gray-600">Lieu</th>
                  <th class="text-left py-3.5 px-6 text-sm font-semibold text-gray-600 hidden md:table-cell">Adresse</th>
                  <th class="text-left py-3.5 px-6 text-sm font-semibold text-gray-600 hidden md:table-cell">Note</th>
                  <th class="text-right py-3.5 px-6 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                <tr *ngFor="let lieu of lieuxList" class="hover:bg-gray-50/50 transition-colors">
                  <td class="py-3.5 px-6 font-medium text-gray-900">{{ lieu.nom }}</td>
                  <td class="py-3.5 px-6 text-sm text-gray-500 hidden md:table-cell">{{ lieu.adresse }}</td>
                  <td class="py-3.5 px-6 hidden md:table-cell">
                    <span class="flex items-center gap-1 text-sm">
                      <svg class="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                      {{ lieu.noteMoyenne | number:'1.1-1' }}
                    </span>
                  </td>
                  <td class="py-3.5 px-6 text-right">
                    <button (click)="deleteLieu(lieu.id)" class="text-red-500 hover:text-red-700 font-medium text-sm">Supprimer</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  criteres: Critere[] = [];
  avisList: AvisAdmin[] = [];
  lieuxList: Lieu[] = [];

  statsLieux = 0;
  statsAvis = 0;
  statsUsers = 0;

  activeTab = 'criteres';
  tabs = [
    { key: 'criteres', label: '🏷️ Critères' },
    { key: 'avis', label: '⭐ Avis' },
    { key: 'lieux', label: '🏢 Lieux' }
  ];

  newCritere: Partial<Critere> = { nom: '', categorie: '', icon: '', actif: true };
  editingCritere: Critere | null = null;

  private avisUrl = `${environment.apiUrl}/avis`;

  constructor(
    private critereService: CritereService,
    private lieuService: LieuService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadCriteres();
    this.loadAvis();
    this.loadLieux();
  }

  // ===== CRITÈRES =====
  loadCriteres(): void {
    this.critereService.findAll().subscribe({
      next: (data) => {
        this.criteres = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erreur chargement critères:', err)
    });
  }

  saveCritere(): void {
    if (!this.newCritere.nom || !this.newCritere.categorie) return;

    const critereData = {
      nom: this.newCritere.nom,
      categorie: this.newCritere.categorie,
      icon: this.newCritere.icon || '',
      description: this.newCritere.description || '',
      actif: true
    } as Critere;

    if (this.editingCritere) {
      this.critereService.update(this.editingCritere.id, critereData).subscribe({
        next: () => {
          this.loadCriteres();
          this.cancelEdit();
        },
        error: (err) => console.error('Erreur modification critère:', err)
      });
    } else {
      this.critereService.create(critereData).subscribe({
        next: () => {
          this.loadCriteres();
          this.newCritere = { nom: '', categorie: '', icon: '', actif: true };
        },
        error: (err) => console.error('Erreur création critère:', err)
      });
    }
  }

  editCritere(critere: Critere): void {
    this.editingCritere = critere;
    this.newCritere = { ...critere };
  }

  cancelEdit(): void {
    this.editingCritere = null;
    this.newCritere = { nom: '', categorie: '', icon: '', actif: true };
  }

  deleteCritere(id: number): void {
    if (confirm('Supprimer ce critère ?')) {
      this.critereService.delete(id).subscribe({
        next: () => this.loadCriteres(),
        error: (err) => console.error('Erreur suppression critère:', err)
      });
    }
  }

  // ===== AVIS =====
  loadAvis(): void {
    this.http.get<AvisAdmin[]>(this.avisUrl).subscribe({
      next: (data) => {
        this.avisList = data;
        this.statsAvis = data.length;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erreur chargement avis:', err)
    });
  }

  deleteAvis(id: number): void {
    if (confirm('Supprimer cet avis ?')) {
      this.http.delete(`${this.avisUrl}/${id}`).subscribe({
        next: () => this.loadAvis(),
        error: (err) => console.error('Erreur suppression avis:', err)
      });
    }
  }

  // ===== LIEUX =====
  loadLieux(): void {
    this.lieuService.findAll().subscribe({
      next: (data) => {
        this.lieuxList = data;
        this.statsLieux = data.length;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erreur chargement lieux:', err)
    });
  }

  deleteLieu(id: number): void {
    if (confirm('Supprimer ce lieu ?')) {
      this.lieuService.delete(id).subscribe({
        next: () => this.loadLieux(),
        error: (err) => console.error('Erreur suppression lieu:', err)
      });
    }
  }
}
