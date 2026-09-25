import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ListingService, Listing } from '../../core/services/listing.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 animate-fade-in-up">
      <div class="mb-10 text-center">
        <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight">Mes Coups de ❤️</h1>
        <p class="text-gray-500 mt-2">Retrouvez toutes les annonces que vous avez sauvegardées.</p>
      </div>

      <div *ngIf="isLoading" class="py-20 flex justify-center">
        <div class="w-12 h-12 border-4 border-watermelon-pink border-t-transparent rounded-full animate-spin"></div>
      </div>

      <div *ngIf="!isLoading && favorites.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <div *ngFor="let item of favorites" [routerLink]="['/listing', item.id]" class="glass-panel group cursor-pointer flex flex-col h-full overflow-hidden hover:shadow-watermelon-pink/10 hover:-translate-y-1 transition-all">
          <div class="relative w-full aspect-[4/5] bg-gray-100 overflow-hidden">
            <img [src]="getListingCover(item)" [alt]="extractLocalString(item.title)" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
            <!-- Bouton unlike (Ã©vite la navigation) -->
            <div (click)="removeFavorite($event, item.id)" class="absolute top-3 right-3 bg-white p-2 rounded-full text-watermelon-pink shadow-md hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" /></svg>
            </div>
          </div>
          <div class="p-5 flex-1 flex flex-col">
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-bold text-lg text-gray-900 leading-tight truncate pr-2">{{ extractLocalString(item.title) }}</h3>
              <span class="font-black text-lg text-watermelon-pink whitespace-nowrap">{{ item.price }}€</span>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="!isLoading && favorites.length === 0" class="py-20 text-center glass-panel border-dashed border-2 border-gray-300">
        <div class="text-6xl mb-4 opacity-50">💔</div>
        <h3 class="text-xl font-bold text-gray-700">Aucun favori pour le moment</h3>
        <p class="text-gray-500 mb-6 mt-2">Parcourez le catalogue et cliquez sur le cœur pour sauvegarder des articles.</p>
        <button routerLink="/" class="px-6 py-3 bg-gradient-to-r from-watermelon-pink to-watermelon-light text-white rounded-full font-bold shadow-md hover:-translate-y-0.5 transition-all">Découvrir les articles</button>
      </div>
    </div>
  `
})
export class FavoritesComponent implements OnInit {
  private listingService = inject(ListingService);
  
  favorites: Listing[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.listingService.getFavorites().subscribe({
      next: (res: any) => {
        this.favorites = res.data;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  removeFavorite(event: Event, listingId: number) {
    event.stopPropagation(); // EmpÃªcher le clic d'ouvrir la page de dÃ©tail
    
    // Retrait optimiste de l'UI
    this.favorites = this.favorites.filter(f => f.id !== listingId);
    
    this.listingService.toggleFavorite(listingId).subscribe();
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
