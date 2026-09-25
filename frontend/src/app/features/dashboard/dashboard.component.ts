import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ListingService, Listing } from '../../core/services/listing.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: \
    <div class="max-w-7xl mx-auto px-4 animate-fade-in-up" *ngIf="authService.currentUser$ | async as user">
      
      <!-- En-tête du Dashboard -->
      <div class="glass-panel p-8 md:p-12 mb-8 relative overflow-hidden">
        <div class="absolute -top-24 -right-24 w-64 h-64 bg-watermelon-pink/20 rounded-full blur-3xl -z-10"></div>
        <div class="flex flex-col md:flex-row items-center gap-6">
          <div class="w-24 h-24 bg-gradient-to-tr from-watermelon-pink to-pink-300 rounded-full shadow-lg overflow-hidden flex items-center justify-center text-white text-3xl font-bold">
            {{ user.name.charAt(0).toUpperCase() }}
          </div>
          <div class="text-center md:text-left">
            <h1 class="text-3xl font-extrabold text-gray-900">Salut, {{ user.name }} ! ??</h1>
            <p class="text-gray-500 mt-1">Gérez vos annonces et vos ventes depuis cet espace.</p>
          </div>
          <div class="md:ml-auto mt-6 md:mt-0 flex flex-wrap justify-center gap-4">
            <button routerLink="/dashboard/inbox" class="px-6 py-3 bg-white text-gray-900 border border-gray-200 rounded-full font-bold shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              Mes Messages
            </button>
            <button routerLink="/dashboard/create" class="px-6 py-3 bg-gray-900 text-white rounded-full font-bold shadow-xl hover:shadow-gray-900/40 hover:-translate-y-1 transition-all flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-watermelon-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
              Nouvelle annonce
            </button>
          </div>
        </div>
      </div>

      <!-- Liste de vos annonces -->
      <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-watermelon-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
        Mon Dressing en ligne
      </h2>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="flex justify-center py-20">
        <div class="w-10 h-10 border-4 border-watermelon-pink border-t-transparent rounded-full animate-spin"></div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!isLoading && myListings.length === 0" class="text-center py-20 glass-panel border-dashed border-2 border-gray-300">
        <div class="text-6xl mb-4 opacity-50">??</div>
        <h3 class="text-xl font-bold text-gray-700">Aucune annonce pour le moment.</h3>
        <p class="text-gray-500 mt-2">Commencez à vider votre maison ou votre dressing en créant votre première annonce !</p>
        <button routerLink="/dashboard/create" class="mt-6 px-6 py-3 bg-watermelon-pink text-white rounded-full font-bold shadow-lg hover:-translate-y-1 transition-transform">Créer ma première annonce</button>
      </div>

      <!-- Grid -->
      <div *ngIf="!isLoading && myListings.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div *ngFor="let listing of myListings" class="glass-panel p-4 flex flex-col group" [ngClass]="{'opacity-60 grayscale': listing.status === 'archived'}">
          
          <div class="aspect-[4/3] rounded-2xl overflow-hidden mb-4 relative bg-gray-100">
            <img [src]="getListingCover(listing)" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
            
            <!-- Badges -->
            <div class="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold shadow-sm">
              {{ listing.price }}€
            </div>
            
            <div *ngIf="listing.status === 'archived'" class="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span class="px-4 py-2 bg-black/60 text-white rounded-full font-bold text-sm backdrop-blur-md border border-white/20">Archivé</span>
            </div>
            <div *ngIf="listing.status === 'sold'" class="absolute inset-0 bg-watermelon-pink/40 flex items-center justify-center">
              <span class="px-4 py-2 bg-watermelon-pink text-white rounded-full font-bold text-sm backdrop-blur-md border border-white/20">Vendu ??</span>
            </div>
          </div>

          <div class="flex-1">
            <h3 class="font-bold text-gray-900 text-lg mb-1 truncate">{{ extractLocalString(listing.title) }}</h3>
            <p class="text-sm text-gray-500 mb-4 line-clamp-2">{{ extractLocalString(listing.description) }}</p>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2 mt-auto border-t border-gray-100 pt-4">
            <button [routerLink]="['/listing', listing.id]" class="flex-1 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
              Voir
            </button>
            <button 
              *ngIf="listing.status === 'active'"
              (click)="archive(listing.id)" 
              class="flex-1 py-2 text-sm font-bold text-yellow-700 bg-yellow-100 hover:bg-yellow-200 rounded-xl transition-colors">
              Archiver
            </button>
            <button 
              (click)="delete(listing.id)"
              class="w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-xl transition-colors shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>

        </div>
      </div>

    </div>
  \
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  listingService = inject(ListingService);

  myListings: Listing[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadListings();
  }

  loadListings() {
    this.isLoading = true;
    this.listingService.getMyListings().subscribe({
      next: (res) => {
        this.myListings = res.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  archive(id: number) {
    if (confirm("Voulez-vous vraiment archiver cette annonce (elle ne sera plus visible) ?")) {
      this.listingService.archiveListing(id).subscribe(() => {
        this.loadListings();
      });
    }
  }

  delete(id: number) {
    if (confirm("Voulez-vous supprimer DÉFINITIVEMENT cette annonce ?")) {
      this.listingService.deleteListing(id).subscribe(() => {
        this.loadListings();
      });
    }
  }

  getListingCover(item: Listing): string {
    if (item.images && item.images.length > 0) {
      const cover = item.images.find(img => img.is_cover) || item.images[0];
      return \/storage/\\;
    }
    return 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80';
  }

  extractLocalString(field: any): string {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field['fr'] || field['en'] || Object.values(field)[0] || '';
  }
}
