import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LieuService } from '../../services/lieu.service';
import { CritereService } from '../../../critere/services/critere.service';
import { Lieu, SearchRequest, SearchResponse } from '../../models/lieu.model';
import { Critere } from '../../../critere/models/critere.model';
import { LieuCardComponent } from '../../../shared/components/lieu-card/lieu-card.component';

@Component({
  selector: 'app-lieu-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, LieuCardComponent],
  templateUrl: './lieu-list.component.html'
})
export class LieuListComponent implements OnInit {
  lieux: Lieu[] = [];
  criteres: Critere[] = [];
  selectedCriteres = new Set<number>();
  loading = false;
  searchQuery = '';
  totalResults = 0;
  filtersOpen = true;

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
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erreur chargement critères:', err)
    });
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

