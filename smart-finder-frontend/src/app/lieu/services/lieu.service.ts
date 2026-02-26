import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lieu, LieuCreateRequest, SearchRequest, SearchResponse } from '../models/lieu.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LieuService {
  private apiUrl = `${environment.apiUrl}/lieux`;

  constructor(private http: HttpClient) { }

  findAll(): Observable<Lieu[]> {
    return this.http.get<Lieu[]>(this.apiUrl);
  }

  findById(id: number): Observable<Lieu> {
    return this.http.get<Lieu>(`${this.apiUrl}/${id}`);
  }

  create(lieu: LieuCreateRequest): Observable<Lieu> {
    return this.http.post<Lieu>(this.apiUrl, lieu);
  }

  update(id: number, lieu: LieuCreateRequest): Observable<Lieu> {
    return this.http.put<Lieu>(`${this.apiUrl}/${id}`, lieu);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  search(request: SearchRequest): Observable<SearchResponse> {
    return this.http.post<SearchResponse>(`${this.apiUrl}/search`, request);
  }

  uploadImage(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string }>(`${environment.apiUrl}/upload/image`, formData);
  }
}
