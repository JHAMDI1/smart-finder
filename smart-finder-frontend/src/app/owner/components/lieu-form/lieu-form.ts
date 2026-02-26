import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LieuService } from '../../../lieu/services/lieu.service';
import { CritereService } from '../../../critere/services/critere.service';
import { Critere } from '../../../critere/models/critere.model';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-lieu-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './lieu-form.html',
  styleUrls: ['./lieu-form.scss'],
})
export class LieuForm implements OnInit {
  lieuForm: FormGroup;
  criteres: Critere[] = [];
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private lieuService: LieuService,
    private critereService: CritereService,
    private router: Router,
    private cdr: ChangeDetectorRef
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
        this.cdr.detectChanges();
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

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        this.error = 'Veuillez sélectionner un fichier image valide.';
        return;
      }
      this.selectedImage = file;

      // Preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
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

    // If an image is selected, upload it first
    if (this.selectedImage) {
      this.lieuService.uploadImage(this.selectedImage).subscribe({
        next: (response) => {
          this.submitLieuData(selectedCritereIds, response.url);
        },
        error: (err) => {
          this.loading = false;
          this.error = "Erreur lors de l'envoi de l'image.";
          console.error(err);
        }
      });
    } else {
      this.submitLieuData(selectedCritereIds, undefined);
    }
  }

  private submitLieuData(selectedCritereIds: number[], imageUrl?: string): void {
    const requestData = {
      ...this.lieuForm.value,
      critereIds: selectedCritereIds,
      ...(imageUrl && { imageUrl })
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
