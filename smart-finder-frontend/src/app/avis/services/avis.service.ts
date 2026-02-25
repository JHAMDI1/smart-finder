import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Avis {
  id: number;
  note: number;
  commentaire?: string;
  auteurNom: string;
  auteurPrenom: string;
  createdAt: string;
}

export interface AvisCreateRequest {
  note: number;
  commentaire?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AvisService {
  private apiUrl = 'http://localhost:8080/api/v1';

  constructor(private http: HttpClient) {}

  findByLieu(lieuId: number): Observable<Avis[]> {
    return this.http.get<Avis[]>(`${this.apiUrl}/lieux/${lieuId}/avis`);
  }

  create(lieuId: number, avis: AvisCreateRequest): Observable<Avis> {
    return this.http.post<Avis>(`${this.apiUrl}/lieux/${lieuId}/avis`, avis);
  }

  delete(lieuId: number, avisId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/lieux/${lieuId}/avis/${avisId}`);
  }
}
