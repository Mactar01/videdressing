import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 animate-fade-in-up">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Panneau d'Administration</h1>
          <p class="text-gray-500 mt-1">Supervisez l'activitÃ© de votre marketplace VideDressing.</p>
        </div>
        <div class="bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md flex items-center gap-2">
          <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          SystÃ¨me En Ligne
        </div>
      </div>

      <div *ngIf="isLoading" class="flex justify-center py-20">
        <div class="w-12 h-12 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
      </div>

      <ng-container *ngIf="!isLoading && stats">
        <!-- Chiffres clÃ©s -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          
          <div class="glass-panel p-6 border-t-4 border-watermelon-pink transform hover:-translate-y-1 transition-all">
            <p class="text-gray-500 font-bold text-sm mb-1 uppercase tracking-wider">Volume des ventes</p>
            <h3 class="text-4xl font-black text-gray-900">{{ stats.metrics.revenue | number:'1.2-2' }} â‚¬</h3>
            <p class="text-green-500 text-xs mt-2 font-bold flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              En croissance
            </p>
          </div>

          <div class="glass-panel p-6 border-t-4 border-blue-400 transform hover:-translate-y-1 transition-all">
            <p class="text-gray-500 font-bold text-sm mb-1 uppercase tracking-wider">Utilisateurs</p>
            <h3 class="text-4xl font-black text-gray-900">{{ stats.metrics.users_count }}</h3>
            <p class="text-gray-400 text-xs mt-2">Membres inscrits</p>
          </div>

          <div class="glass-panel p-6 border-t-4 border-orange-400 transform hover:-translate-y-1 transition-all">
            <p class="text-gray-500 font-bold text-sm mb-1 uppercase tracking-wider">Annonces</p>
            <h3 class="text-4xl font-black text-gray-900">{{ stats.metrics.listings_count }}</h3>
            <p class="text-gray-400 text-xs mt-2">{{ stats.metrics.active_listings_count }} actives en ce moment</p>
          </div>

          <div class="glass-panel p-6 border-t-4 border-green-400 transform hover:-translate-y-1 transition-all">
            <p class="text-gray-500 font-bold text-sm mb-1 uppercase tracking-wider">Commandes</p>
            <h3 class="text-4xl font-black text-gray-900">{{ stats.metrics.orders_count }}</h3>
            <p class="text-gray-400 text-xs mt-2">Transactions totales</p>
          </div>
          
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <!-- Derniers Inscrits -->
          <div class="glass-panel p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-xl font-bold text-gray-900">Derniers Inscrits</h3>
              <button class="text-watermelon-pink text-sm font-bold hover:underline">Voir tout</button>
            </div>
            <div class="space-y-4">
              <div *ngFor="let user of stats.recent_users" class="flex items-center gap-4 p-3 hover:bg-white/50 rounded-xl transition-colors">
                <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-100 to-blue-200 flex items-center justify-center font-bold text-blue-800">
                  {{ user.name.charAt(0) }}
                </div>
                <div class="flex-1">
                  <h4 class="font-bold text-gray-900 text-sm">{{ user.name }}</h4>
                  <p class="text-xs text-gray-500">{{ user.email }}</p>
                </div>
                <button class="text-gray-400 hover:text-red-500 transition-colors" title="Bannir">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                </button>
              </div>
            </div>
          </div>

          <!-- DerniÃ¨res Annonces -->
          <div class="glass-panel p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-xl font-bold text-gray-900">Annonces RÃ©centes</h3>
              <button class="text-watermelon-pink text-sm font-bold hover:underline">Voir tout</button>
            </div>
            <div class="space-y-4">
              <div *ngFor="let listing of stats.recent_listings" class="flex items-center gap-4 p-3 hover:bg-white/50 rounded-xl transition-colors">
                <div class="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                  <img *ngIf="listing.images?.length" [src]="'/storage/' + listing.images[0].path" class="w-full h-full object-cover">
                </div>
                <div class="flex-1 overflow-hidden">
                  <h4 class="font-bold text-gray-900 text-sm truncate">{{ extractLocalString(listing.title) }}</h4>
                  <p class="text-xs text-watermelon-pink font-bold">{{ listing.price }} â‚¬</p>
                </div>
                <div class="flex gap-2">
                  <button class="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-200 transition-colors" title="Valider">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                  </button>
                  <button class="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors" title="Supprimer">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ng-container>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  private http = inject(HttpClient);
  
  stats: any = null;
  isLoading = true;

  ngOnInit() {
    this.http.get(`/api/v1/admin/dashboard`).subscribe({
      next: (res: any) => {
        this.stats = res.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  extractLocalString(field: any): string {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field['fr'] || field['en'] || Object.values(field)[0] || '';
  }
}
