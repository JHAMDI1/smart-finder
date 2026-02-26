import { Critere } from '../../critere/models/critere.model';

export interface Lieu {
  id: number;
  nom: string;
  adresse: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  horaires?: string;
  noteMoyenne: number;
  criteres?: Critere[];
  images?: string[];
  imageUrl?: string;
  createdAt?: string;
}

export interface LieuCreateRequest {
  nom: string;
  adresse: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  horaires?: string;
  critereIds: number[];
}

export interface SearchRequest {
  critereIds?: number[];
  minNote?: number;
  search?: string;
  page?: number;
  size?: number;
}

export interface SearchResponse {
  content: Lieu[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
}
