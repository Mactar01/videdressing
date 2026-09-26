import { HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
   * Récupère la liste des annonces disponibles
   */
  getListings(): Observable<{data: Listing[]} | Listing[]> {
    return this.http.get<{data: Listing[]} | Listing[]>(this.apiUrl);
  }

  /**
   * Crée une nouvelle annonce (générique avec attributs dynamiques)
   */
  getFavorites(): Observable<any> {
    return this.http.get('/api/v1/favorites');
  }

  toggleFavorite(listingId: number): Observable<any> {
    return this.http.post('/api/v1/listings/'+listingId+'/favorite', {});
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
    return this.http.post(`${this.apiUrl}/${listingId}/images`, formData, { responseType: 'text' }).pipe(
      map(res => {
        try {
          // Si PHP a affiché un Warning/Notice (ex: PHP Request Startup: file created in temp dir...)
          // On nettoie la chaîne avant le premier {
          if (typeof res === 'string' && res.indexOf('{') !== -1) {
            const jsonStr = res.substring(res.indexOf('{'));
            return JSON.parse(jsonStr);
          }
          return res;
        } catch (e) {
          return res;
        }
      })
    );
  }

  /**
   * Publie l'annonce (Passe de Draft Ã  Active)
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
   * Archive une annonce (équivalent Ã  marquer comme vendu/indisponible)
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


