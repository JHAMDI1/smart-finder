import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LieuService } from '../../../lieu/services/lieu.service';
import { CritereService } from '../../../critere/services/critere.service';
import { Critere } from '../../../critere/models/critere.model';

@Component({
  selector: 'app-lieu-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './lieu-form.html',
  styleUrl: './lieu-form.scss',
})
export class LieuForm implements OnInit {
  lieuForm: FormGroup;
  criteres: Critere[] = [];
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private lieuService: LieuService,
    private critereService: CritereService,
    private router: Router
  ) {
    this.lieuForm = this.fb.group({
      nom: ['', [Validators.required, Validators.maxLength(255)]],
      adresse: ['', [Validators.required, Validators.maxLength(500)]],
      description: [''],
      horaires: [''],
      latitude: [null],
      longitude: [null],
      critereIds: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadCriteres();
  }

  loadCriteres(): void {
    this.critereService.findActifs().subscribe({
      next: (data) => {
        this.criteres = data;
        this.addCritereCheckboxes();
      },
      error: (err) => {
        console.error('Erreur chargement critères', err);
      }
    });
  }

  private addCritereCheckboxes() {
    // Initialise le FormArray avec des FormControl à false pour chaque critère
    this.criteres.forEach(() => {
      this.critereIdsFormArray.push(new FormControl(false));
    });
  }

  get critereIdsFormArray() {
    return this.lieuForm.controls['critereIds'] as FormArray;
  }

  onSubmit(): void {
    if (this.lieuForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    // Extraire les identifiants sélectionnés
    const selectedCritereIds = this.lieuForm.value.critereIds
      .map((checked: boolean, i: number) => checked ? this.criteres[i].id : null)
      .filter((v: number | null) => v !== null);

    const requestData = {
      ...this.lieuForm.value,
      critereIds: selectedCritereIds
    };

    this.lieuService.create(requestData).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/owner/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Erreur lors de la création du lieu. Vérifiez les informations saisies.';
        console.error(err);
      }
    });
  }
}
