import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Category {
  id: number;
  name: any;
  slug: string;
  icon?: string;
  children?: Category[];
}

export interface CategoryAttribute {
  id: number;
  category_id: number;
  key: string;
  label: any;
  type: 'text' | 'number' | 'select' | 'multiselect' | 'boolean' | 'date' | 'range';
  options?: any[];
  is_required: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/categories';

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  getAttributes(categoryId: number): Observable<CategoryAttribute[]> {
    return this.http.get<CategoryAttribute[]>(`${this.apiUrl}/${categoryId}/attributes`);
  }
}
