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
  templateUrl: './lieu-detail.component.html'
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
