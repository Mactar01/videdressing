import { Routes } from '@angular/router';
import { FavoritesComponent } from './features/favorites/favorites.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    title: 'VideDressing - Accueil'
  },
  {
    path: 'listing/:id',
    loadComponent: () => import('./features/listings/listing-detail.component').then(m => m.ListingDetailComponent),
  },
  {
    path: 'search',
    loadComponent: () => import('./features/search/search.component').then(m => m.SearchComponent),
    title: 'VideDressing - Recherche'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent),
    title: 'VideDressing - Connexion'
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        title: 'Tableau de bord'
      },
      {
        path: 'create',
        loadComponent: () => import('./features/dashboard/create-listing.component').then(m => m.CreateListingComponent),
        title: 'Déposer une annonce'
      } , { path: 'inbox', loadComponent: () => import('./features/dashboard/inbox.component').then(m => m.InboxComponent) }, { path: 'inbox/:id', loadComponent: () => import('./features/dashboard/inbox.component').then(m => m.InboxComponent) }
    ]
  }
  { path: 'admin/dashboard', component: AdminDashboardComponent },
  { path: 'dashboard/favorites', component: FavoritesComponent },
];



