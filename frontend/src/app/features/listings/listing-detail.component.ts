import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { MessageService } from '../../core/services/message.service';
import { ListingService, Listing } from '../../core/services/listing.service';
import { AuthService } from '../../core/services/auth.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-listing-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="animate-fade-in-up" *ngIf="listing; else loadingOrError">
      
      <!-- Fil d'ariane -->
      <nav class="mb-8 text-sm font-medium text-gray-500">
        <a routerLink="/" class="hover:text-watermelon-pink transition-colors">Accueil</a>
        <span class="mx-2">/</span>
        <a href="#" class="hover:text-watermelon-pink transition-colors">{{ extractLocalString(listing.category?.name) || 'CatÃ©gorie' }}</a>
        <span class="mx-2">/</span>
        <span class="text-gray-900">{{ extractLocalString(listing.title) }}</span>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        <!-- Section Gauche : Galerie d'images -->
        <div class="lg:col-span-7 space-y-6">
          <div class="w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-lg bg-gray-100">
            <!-- Image de couverture ou Placeholder -->
            <img 
              [src]="coverImageUrl()" 
              [alt]="extractLocalString(listing.title)" 
              class="w-full h-full object-cover"
            >
          </div>
          <!-- (Pour plus tard) Miniatures d'images -->
        </div>

        <!-- Section Droite : Panneau d'informations Glassmorphism -->
        <div class="lg:col-span-5 relative">
          <!-- Ce panneau reste collÃ© Ã  l'Ã©cran lors du dÃ©filement -->
          <div class="sticky top-28 glass-panel p-8">
            <div class="flex justify-between items-start mb-4">
              <h1 class="text-3xl font-extrabold text-gray-900 leading-tight">
                {{ extractLocalString(listing.title) }}
              </h1>
              <button class="text-gray-400 hover:text-watermelon-pink transition-colors p-2 bg-white/50 rounded-full shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              </button>
            </div>
            
            <p class="text-4xl font-black text-watermelon-pink mb-6">
              {{ listing.price }} {{ listing.currency }}
            </p>

            <div class="space-y-4 mb-8 text-sm">
              <div class="flex justify-between py-3 border-b border-gray-200/50">
                <span class="text-gray-500 font-medium">Ã‰tat</span>
                <span class="text-gray-900 font-bold uppercase tracking-wider text-xs">{{ listing.condition }}</span>
              </div>
              <div class="flex justify-between py-3 border-b border-gray-200/50">
                <span class="text-gray-500 font-medium">Localisation</span>
                <span class="text-gray-900 font-bold">{{ listing.city }}</span>
              </div>
            </div>

            <!-- Boutons d'action conditionnels (Authentification requise) -->
            <div class="space-y-4 mt-8" *ngIf="!authService.currentUserValue || authService.currentUserValue.id !== listing.user_id">
              <button (click)="handleProtectedAction('buy')" class="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold shadow-xl hover:shadow-gray-900/40 hover:-translate-y-0.5 transition-all text-lg">
                Acheter maintenant
              </button>
              <button (click)="handleProtectedAction('contact')" class="w-full py-4 bg-white/60 backdrop-blur-md border border-gray-200 text-gray-900 rounded-2xl font-bold shadow-lg hover:bg-white hover:-translate-y-0.5 transition-all text-lg flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-watermelon-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                Contacter le vendeur
              </button>
            </div>

            <!-- Profil du Vendeur -->
            <div class="mt-8 pt-6 border-t border-gray-200/50 flex items-center gap-4 cursor-pointer hover:bg-white/40 p-3 rounded-2xl transition-colors">
               <div class="w-12 h-12 bg-gradient-to-tr from-purple-400 to-pink-300 rounded-full flex-shrink-0"></div>
               <div>
                 <p class="text-sm text-gray-500">Vendu par</p>
                 <p class="font-bold text-gray-900">{{ listing.user?.name || 'Vendeur Anonyme' }}</p>
               </div>
            </div>

          </div>
        </div>
      </div>

      <!-- Section Description (Sous les images) -->
      <div class="lg:col-span-7 mt-12 glass-panel p-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Description</h2>
        <p class="text-gray-600 leading-relaxed whitespace-pre-line">
          {{ extractLocalString(listing.description) || 'Aucune description fournie.' }}
        </p>
      </div>
      
    </div>

    <!-- Templates alternatifs -->
    <ng-template #loadingOrError>
      <div class="py-20 text-center text-gray-500 animate-pulse" *ngIf="!hasError">
        Chargement de la pÃ©pite...
      </div>
      <div class="py-20 text-center text-red-500" *ngIf="hasError">
        <h2 class="text-2xl font-bold mb-4">Annonce introuvable</h2>
        <button routerLink="/" class="px-6 py-3 bg-gray-900 text-white rounded-full">Retour Ã  l'accueil</button>
      </div>
    </ng-template>
  `
})
export class ListingDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private listingService = inject(ListingService);
  public authService = inject(AuthService);
  private messageService = inject(MessageService);

  listing: Listing | null = null;
  hasError = false;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchListing(id);
    }
  }

  fetchListing(id: string) {
    this.listingService.getListing(id).pipe(
      catchError(err => {
        this.hasError = true;
        // Permet au SSR de renvoyer un code 404 (idÃ©alement via un token d'injection serveur)
        return of(null);
      })
    ).subscribe(data => {
      if (data) {
        this.listing = data;
        this.updateSeoTags(data);
      }
    });
  }

  updateSeoTags(listing: Listing) {
    const title = this.extractLocalString(listing.title);
    const description = this.extractLocalString(listing.description)?.substring(0, 160) || 'DÃ©couvrez cet article sur VideDressing.';
    const imageUrl = this.coverImageUrl();

    // Rendu cÃ´tÃ© serveur pour le SEO Google
    this.titleService.setTitle(`${title} - Vendu par ${listing.user?.name} | VideDressing`);
    
    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:image', content: imageUrl });
    this.metaService.updateTag({ property: 'og:type', content: 'product' });
    this.metaService.updateTag({ property: 'product:price:amount', content: listing.price });
    this.metaService.updateTag({ property: 'product:price:currency', content: listing.currency });
  }

  /**
   * Extrait la valeur traduite d'un champ JSON (titre, description, etc.)
   */
  extractLocalString(field: any): string {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field['fr'] || field['en'] || Object.values(field)[0] || '';
  }

  /**
   * Retourne l'URL de la premiÃ¨re image, ou un joli dÃ©gradÃ© par dÃ©faut
   */
  coverImageUrl(): string {
    if (this.listing?.images && this.listing.images.length > 0) {
      const cover = this.listing.images.find(img => img.is_cover) || this.listing.images[0];
      return `/storage/${cover.path}`;
    }
    return 'https://images.unsplash.com/photo-1434389678278-be4d41a6b872?w=800&q=80';
  }

  /**
   * VÃ©rifie si l'utilisateur est connectÃ© avant d'Acheter ou de Contacter.
   * Sinon, le redirige vers le login avec un paramÃ¨tre "returnUrl".
   */
  handleProtectedAction(action: 'buy' | 'contact') {
    if (this.authService.currentUserValue) {
      if (action === 'buy') {
        // Redirection vers le checkout
        console.log("Ouverture du module de paiement Stripe");
      } else {
          this.messageService.startConversation(this.listing!.id).subscribe({
            next: (conv) => {
               this.router.navigate(['/dashboard/inbox', conv.id]);
            },
            error: (err) => {
               alert(err.error?.message || "Impossible de dmarrer la conversation.");
            }
          });
        }
    } else {
      // Redirection vers login en mÃ©morisant l'URL courante
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url }});
    }
  }
}


