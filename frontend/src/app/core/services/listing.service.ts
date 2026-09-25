import { HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Listing {
  id: number;
  title: any; // JSON localisé
  description?: any;
  price: string;
  currency: string;
  condition: string;
  city: string;
  status: string;
  user_id: number;
  category_id: number;
  user?: { id: number, name: string, avatar?: string };
  category?: { id: number, name: any };
  images?: { id: number, path: string, is_cover: boolean }[];
  attributes?: { id: number, value: any, attribute: { key: string, label: any, type: string } }[];
}

@Injectable({
  providedIn: 'root'
})
export class ListingService {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/listings';

  /**
   * Récupère les détails d'une annonce spécifique
   */
  getListing(id: number | string): Observable<Listing> {
    return this.http.get<Listing>(`${this.apiUrl}/${id}`);
  }

  /**
   * Récupère la liste des annonces via Meilisearch / Scout
   */
  searchListings(query: string = ''): Observable<Listing[]> {
    return this.http.get<Listing[]>('/api/v1/search', { params: { q: query } });
  }

  /**
   * Crée une nouvelle annonce (générique avec attributs dynamiques)
   */
  getFavorites(): Observable<any> {
    return this.http.get(/api/v1/favorites);
  }

  toggleFavorite(listingId: number): Observable<any> {
    return this.http.post(/api/v1/listings//favorite, {});
  }

  createListing(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }

  /**
   * Upload une image pour une annonce existante (Draft)
   */
  uploadImage(listingId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post(`${this.apiUrl}/${listingId}/images`, formData);
  }

  /**
   * Publie l'annonce (Passe de Draft à Active)
   */
  publishListing(listingId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${listingId}/publish`, {});
  }

  /**
   * Récupère les annonces de l'utilisateur connecté
   */
  getMyListings(): Observable<{data: Listing[]}> {
    return this.http.get<{data: Listing[]}>(`/api/v1/my-listings`);
  }

  /**
   * Archive une annonce (équivalent à marquer comme vendu/indisponible)
   */
  archiveListing(listingId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${listingId}/archive`, {});
  }

  /**
   * Supprime définitivement une annonce
   */
  deleteListing(listingId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${listingId}`);
  }
}


