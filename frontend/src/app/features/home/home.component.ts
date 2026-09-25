import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoryService, Category } from '../../core/services/category.service';
import { ListingService, Listing } from '../../core/services/listing.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-16 animate-fade-in-up">
      <!-- Hero Section -->
      <section class="text-center py-20 px-4">
        <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 drop-shadow-sm">
          Faites le tri, <br/>
          <span class="text-gradient">vendez tout.</span>
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Meubles, électroménager, mode ou high-tech. Donnez une seconde vie à vos objets sur la plateforme de référence.
        </p>
        <div class="flex justify-center gap-6">
          <button class="px-8 py-4 bg-gray-900 text-white rounded-full font-bold shadow-2xl hover:shadow-gray-900/40 hover:-translate-y-1 transition-all">
            Déposer une annonce
          </button>
        </div>
      </section>

      <!-- Catégories Vedettes (Glass panels) -->
      <section *ngIf="categories.length > 0">
        <div class="flex items-center justify-between mb-8 px-2">
          <h2 class="text-2xl font-bold text-gray-900">Univers à explorer</h2>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <div *ngFor="let cat of categories" class="glass-panel p-6 flex flex-col items-center text-center cursor-pointer hover:shadow-watermelon-pink/20 hover:-translate-y-1 transition-all group relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <!-- Si l'icône de la DB correspond à des émojis ou du texte SVG, on gère ici. Pour le MVP, on utilise des emojis mappés. -->
            <div class="text-3xl mb-3">{{ getCategoryEmoji(cat.slug) }}</div>
            <h3 class="font-bold text-gray-900 text-sm">{{ extractLocalString(cat.name) }}</h3>
          </div>
        </div>
      </section>

      <!-- Sélection d'annonces API -->
      <section *ngIf="listings.length > 0">
        <h2 class="text-2xl font-bold text-gray-900 mb-8 px-2">Dernières trouvailles</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Carte Annonce -->
          <div *ngFor="let item of listings" [routerLink]="['/listing', item.id]" class="glass-panel group cursor-pointer flex flex-col h-full overflow-hidden hover:shadow-watermelon-pink/10 hover:-translate-y-1 transition-all">
            <div class="relative w-full aspect-[4/5] bg-gray-100 overflow-hidden">
              <img [src]="getListingCover(item)" alt="Produit" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
              <div class="absolute top-3 right-3 bg-white/80 backdrop-blur-md p-2 rounded-full text-watermelon-pink shadow-md hover:bg-watermelon-pink hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              </div>
            </div>
            <div class="p-5 flex-1 flex flex-col">
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-bold text-lg text-gray-900 leading-tight truncate pr-2">{{ extractLocalString(item.title) }}</h3>
                <span class="font-black text-lg text-watermelon-pink whitespace-nowrap">{{ item.price }}€</span>
              </div>
              <p class="text-sm text-gray-500 mb-3 truncate">{{ item.city }} • {{ item.condition }}</p>
              <div class="mt-auto flex items-center gap-2 pt-3 border-t border-gray-100/50">
                <div class="w-6 h-6 bg-gradient-to-tr from-purple-400 to-pink-300 rounded-full"></div>
                <span class="text-xs text-gray-600 font-medium truncate">{{ item.user?.name || 'Vendeur' }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `
})
export class HomeComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private listingService = inject(ListingService);

  categories: Category[] = [];
  listings: Listing[] = [];

  ngOnInit() {
    this.categoryService.getCategories().subscribe(res => {
      // On prend les catégories principales
      this.categories = res;
    });

    this.listingService.searchListings('').subscribe(res => {
      // Pour l'instant, c'est branché sur l'index des listings.
      // Si la pagination est utilisée par l'API, il faudra adapter (res.data)
      // En l'état, on suppose que l'API renvoie un tableau ou un objet paginé
      this.listings = Array.isArray(res) ? res.slice(0, 8) : (res as any).data?.slice(0, 8) || [];
    });
  }

  getCategoryEmoji(slug: string): string {
    const map: any = {
      'vetements': '👕',
      'chaussures': '👟',
      'accessoires': '👜',
      'enfants': '🧸',
      'maison': '🛋️',
      'high-tech': '📱',
      'electromenager': '🧺'
    };
    return map[slug] || '📦';
  }

  extractLocalString(field: any): string {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field['fr'] || field['en'] || Object.values(field)[0] || '';
  }

  getListingCover(item: Listing): string {
    if (item.images && item.images.length > 0) {
      const cover = item.images.find(img => img.is_cover) || item.images[0];
      return `/storage/${cover.path}`;
    }
    return 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80';
  }
}
