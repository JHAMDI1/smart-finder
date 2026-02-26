import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Lieu } from '../../../lieu/models/lieu.model';

@Component({
    selector: 'app-lieu-card',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './lieu-card.component.html'
})
export class LieuCardComponent {
    @Input() lieu!: Lieu;
    @Input() compact: boolean = false;
}
