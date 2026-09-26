import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ListingService, Listing } from '../../core/services/listing.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 animate-fade-in-up flex flex-col md:flex-row gap-8">
      
      <!-- Colonne Filtres (Sidebar) -->
      <aside class="w-full md:w-64 flex-shrink-0">
        <div class="glass-panel p-6 sticky top-24">
          <h2 class="text-xl font-extrabold text-gray-900 dark:text-white mb-6">Filtres</h2>
          
          <!-- Tri -->
          <div class="mb-6">
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">Trier par</label>
            <select [(ngModel)]="filters.sort" (change)="applyFilters()" class="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 dark:border-gray-700 text-gray-900 dark:text-white dark:text-white rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-watermelon-pink/50 focus:border-transparent outline-none transition-all">
              <option class="dark:bg-gray-800 dark:text-white" value="relevance">Pertinence</option>
              <option class="dark:bg-gray-800 dark:text-white" value="date">Les plus récents</option>
              <option class="dark:bg-gray-800 dark:text-white" value="price_asc">Prix croissant</option>
              <option class="dark:bg-gray-800 dark:text-white" value="price_desc">Prix décroissant</option>
            </select>
          </div>
          
          <hr class="border-gray-200 dark:border-gray-700 mb-6">

          <!-- Prix -->
          <div class="mb-6">
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">Prix ()</label>
            <div class="flex items-center gap-2">
              <input type="number" [(ngModel)]="filters.min_price" placeholder="Min" class="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 dark:border-gray-700 text-gray-900 dark:text-white dark:text-white rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-watermelon-pink/50 outline-none transition-all">
              <span class="text-gray-400">-</span>
              <input type="number" [(ngModel)]="filters.max_price" placeholder="Max" class="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 dark:border-gray-700 text-gray-900 dark:text-white dark:text-white rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-watermelon-pink/50 outline-none transition-all">
            </div>
          </div>
          
          <hr class="border-gray-200 dark:border-gray-700 mb-6">

          <!-- tat -->
          <div class="mb-6">
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-3">tat de l'article</label>
            <div class="space-y-2">
              <label class="flex items-center gap-3 cursor-pointer group">
                <input type="radio" name="condition" [(ngModel)]="filters.condition" value="" class="w-4 h-4 text-watermelon-pink border-gray-300 focus:ring-watermelon-pink">
                <span class="text-sm text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:text-white">Tous les tats</span>
              </label>
              <label class="flex items-center gap-3 cursor-pointer group">
                <input type="radio" name="condition" [(ngModel)]="filters.condition" value="new" class="w-4 h-4 text-watermelon-pink border-gray-300 focus:ring-watermelon-pink">
                <span class="text-sm text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:text-white">Neuf avec tiquette</span>
              </label>
              <label class="flex items-center gap-3 cursor-pointer group">
                <input type="radio" name="condition" [(ngModel)]="filters.condition" value="like_new" class="w-4 h-4 text-watermelon-pink border-gray-300 focus:ring-watermelon-pink">
                <span class="text-sm text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:text-white">Trs bon tat</span>
              </label>
              <label class="flex items-center gap-3 cursor-pointer group">
                <input type="radio" name="condition" [(ngModel)]="filters.condition" value="good" class="w-4 h-4 text-watermelon-pink border-gray-300 focus:ring-watermelon-pink">
                <span class="text-sm text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:text-white">Bon tat</span>
              </label>
            </div>
          </div>

          <!-- Bouton d'action -->
          <button (click)="applyFilters()" class="w-full py-3 bg-gray-900 text-white rounded-xl font-bold shadow-md hover:-translate-y-0.5 transition-all">
            Voir les résultats
          </button>
          
        </div>
      </aside>

      <!-- Colonne Principale (Résultats) -->
      <main class="flex-1">
        <!-- En-tête de recherche -->
        <div class="mb-8">
          <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Résultats <span *ngIf="query">pour "<span class="text-watermelon-pink">{{ query }}</span>"</span>
          </h1>
          <p class="text-gray-500 dark:text-gray-400 mt-1">
            {{ totalResults }} pépites trouvées pour vous.
          </p>
        </div>

        <!-- Grille des résultats -->
        <div *ngIf="!isLoading && results.length > 0" class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          <div *ngFor="let item of results" [routerLink]="['/listing', item.id]" class="glass-panel group cursor-pointer flex flex-col h-full overflow-hidden hover:shadow-watermelon-pink/10 hover:-translate-y-1 transition-all">
            <div class="relative w-full aspect-[4/5] bg-gray-100 overflow-hidden">
              <img [src]="getListingCover(item)" [alt]="extractLocalString(item.title)" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
              <div class="absolute top-3 right-3 bg-white/80 backdrop-blur-md p-2 rounded-full text-watermelon-pink shadow-md hover:bg-watermelon-pink hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              </div>
            </div>
            <div class="p-4 flex-1 flex flex-col">
              <div class="flex justify-between items-start mb-1">
                <h3 class="font-bold text-gray-900 dark:text-white leading-tight truncate pr-2">{{ extractLocalString(item.title) }}</h3>
                <span class="font-black text-watermelon-pink whitespace-nowrap">{{ item.price }}</span>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-3 truncate">{{ item.city || 'Paris' }}  {{ item.condition }}</p>
              <div class="mt-auto flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-700/50">
                <div class="w-5 h-5 bg-gradient-to-tr from-purple-400 to-pink-300 rounded-full flex-shrink-0"></div>
                <span class="text-xs text-gray-600 dark:text-gray-300 font-medium truncate">{{ item.user?.name || 'Vendeur' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- tats Vides / Chargement -->
        <div *ngIf="isLoading" class="py-20 flex justify-center">
          <div class="w-10 h-10 border-4 border-watermelon-pink border-t-transparent rounded-full animate-spin"></div>
        </div>
        
        <div *ngIf="!isLoading && results.length === 0" class="py-20 text-center glass-panel border-dashed border-2 border-gray-300">
          <div class="text-6xl mb-4 opacity-50">😕</div>
          <h3 class="text-xl font-bold text-gray-700 dark:text-gray-200">Aucun résultat trouvé</h3>
          <p class="text-gray-500 dark:text-gray-400 mt-2">Essayez de retirer certains filtres ou de modifier vos termes de recherche.</p>
          <button (click)="resetFilters()" class="mt-4 px-6 py-2 bg-gray-200 text-gray-700 dark:text-gray-200 rounded-full text-sm font-bold hover:bg-gray-300 transition-colors">Réinitialiser les filtres</button>
        </div>
      </main>

    </div>
    `
  })
export class SearchComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private listingService = inject(ListingService);

  query = '';
  results: Listing[] = [];
  totalResults = 0;
  isLoading = false;

  filters: any = {
    sort: 'relevance',
    min_price: null,
    max_price: null,
    condition: ''
  };

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.query = params['q'] || '';
      this.performSearch();
    });
  }

  applyFilters() {
    this.performSearch();
  }

  resetFilters() {
    this.filters = { sort: 'relevance', min_price: null, max_price: null, condition: '' };
    this.performSearch();
  }

  performSearch() {
    this.isLoading = true;
    this.listingService.searchListings({ q: this.query, ...this.filters }).subscribe({
      next: (res: any) => {
        this.results = res.data || [];
        this.totalResults = res.meta?.total || this.results.length;
        this.isLoading = false;
      },
      error: () => {
        this.results = [];
        this.totalResults = 0;
        this.isLoading = false;
      }
    });
  }

  extractLocalString(field: any): string {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field['fr'] || field['en'] || Object.values(field)[0] || '';
  }

  getListingCover(item: Listing): string {
    if (item.images && item.images.length > 0) {
      const cover = item.images.find(img => img.is_cover) || item.images[0];
      return '/storage/' + item.images[0].path;
    }
    return 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80';
  }
}
