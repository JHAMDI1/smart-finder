import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LieuService } from '../../../lieu/services/lieu.service';
import { Lieu } from '../../../lieu/models/lieu.model';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './owner-dashboard.html',
  styleUrls: ['./owner-dashboard.scss'],
})
export class OwnerDashboard implements OnInit {
  mesLieux: Lieu[] = [];
  loading = true;
  error = '';

  constructor(
    private lieuService: LieuService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadMesLieux();
  }

  loadMesLieux(): void {
    this.loading = true;
    this.lieuService.findAll().subscribe({
      next: (tousLieux) => {
        // En attendant une route backend spécifique `/mes-lieux`, on filtre en frontend sur l'ID de l'owner
        // (En pratique, le backend devrait avoir un endpoint /lieux/me)
        const currentUser = this.authService.getCurrentUser();
        if (currentUser) {
          // Note: Le backend actuel ne retourne pas le proprietaire_id dans le DTO. 
          // C'est un point à améliorer sur le backend, mais pour le moment on affiche tout 
          // ou on simule en filtrant si possible. 
          this.mesLieux = tousLieux; // Affichons tout pour la démonstration du dashboard pro
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement de vos lieux.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  deleteLieu(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet établissement ?')) {
      this.lieuService.delete(id).subscribe({
        next: () => {
          this.mesLieux = this.mesLieux.filter(l => l.id !== id);
        },
        error: (err) => {
          alert('Erreur lors de la suppression.');
          console.error(err);
        }
      });
    }
  }
}
