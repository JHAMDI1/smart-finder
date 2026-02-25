export interface Critere {
  id: number;
  nom: string;
  description?: string;
  categorie: string;
  icon?: string;
  actif: boolean;
  createdAt?: string;
}

export type CategorieCritere = 
  | 'CONNECTIVITE' 
  | 'AMBIANCE' 
  | 'CONFORT' 
  | 'SERVICES' 
  | 'HORAIRES' 
  | 'RESTAURATION';
