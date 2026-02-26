export interface Utilisateur {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: 'USER' | 'OWNER' | 'ADMIN';
  createdAt?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  role: 'USER' | 'OWNER' | 'ADMIN';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: 'USER' | 'OWNER' | 'ADMIN';
}
