import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-[80vh] flex items-center justify-center p-4">
      
      <!-- Blob décoratif supplémentaire en arrière-plan du login -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-watermelon-pink/20 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
      
      <!-- Le Panneau de Verre (Glassmorphism) -->
      <div class="glass-panel w-full max-w-md p-8 md:p-10 animate-fade-in-up">
        
        <div class="text-center mb-8">
          <div class="w-16 h-16 mx-auto bg-gradient-to-br from-watermelon-pink to-watermelon-light rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-lg mb-4 transform rotate-3 hover:rotate-6 transition-transform">
            V
          </div>
          <h2 class="text-3xl font-bold text-gray-900 tracking-tight">
            {{ isLoginMode ? 'Bon retour !' : 'Rejoignez-nous' }}
          </h2>
          <p class="text-gray-500 mt-2 text-sm">
            {{ isLoginMode ? 'Connectez-vous pour continuer sur VideDressing.' : 'Créez un compte pour vendre et acheter.' }}
          </p>
        </div>

        <!-- Messages d'erreur -->
        <div *ngIf="errorMessage" class="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 flex items-start gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          {{ errorMessage }}
        </div>

        <form [formGroup]="authForm" (ngSubmit)="onSubmit()" class="space-y-5">
          
          <!-- Champ Nom (Uniquement pour inscription) -->
          <div *ngIf="!isLoginMode" class="space-y-1 animate-fade-in-up">
            <label class="block text-sm font-semibold text-gray-700">Nom complet</label>
            <input 
              type="text" 
              formControlName="name"
              placeholder="Prénom Nom"
              class="w-full bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-watermelon-pink/50 focus:bg-white transition-all shadow-sm"
            >
          </div>

          <!-- Champ Email -->
          <div class="space-y-1">
            <label class="block text-sm font-semibold text-gray-700">Adresse e-mail</label>
            <input 
              type="email" 
              formControlName="email"
              placeholder="vous@exemple.com"
              class="w-full bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-watermelon-pink/50 focus:bg-white transition-all shadow-sm"
            >
          </div>

          <!-- Champ Mot de passe -->
          <div class="space-y-1">
            <label class="block text-sm font-semibold text-gray-700">Mot de passe</label>
            <input 
              type="password" 
              formControlName="password"
              placeholder="••••••••"
              class="w-full bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-watermelon-pink/50 focus:bg-white transition-all shadow-sm"
            >
            <div *ngIf="isLoginMode" class="flex justify-end pt-1">
              <a href="#" class="text-xs text-watermelon-pink hover:underline font-medium">Mot de passe oublié ?</a>
            </div>
          </div>

          <!-- Bouton Soumettre -->
          <button 
            type="submit" 
            [disabled]="authForm.invalid || isLoading"
            class="w-full py-3.5 mt-2 bg-gradient-to-r from-watermelon-pink to-watermelon-light text-white rounded-xl font-bold shadow-lg hover:shadow-watermelon-pink/40 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center gap-2"
          >
            <span *ngIf="isLoading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            {{ isLoginMode ? 'Se connecter' : 'Créer mon compte' }}
          </button>
        </form>

        <!-- Toggle Mode -->
        <p class="mt-8 text-center text-sm text-gray-600">
          {{ isLoginMode ? 'Nouveau sur VideDressing ?' : 'Déjà un compte ?' }}
          <button (click)="toggleMode()" class="text-watermelon-pink font-bold hover:underline focus:outline-none ml-1">
            {{ isLoginMode ? 'Créer un compte' : 'Se connecter' }}
          </button>
        </p>

      </div>
    </div>
  `
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  authForm: FormGroup;
  isLoginMode = true;
  isLoading = false;
  errorMessage = '';
  returnUrl = '/';

  constructor() {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      name: ['']
    });
  }

  ngOnInit() {
    // On mémorise l'URL depuis laquelle l'utilisateur vient pour le rediriger après
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    
    // S'il est déjà connecté, on le redirige directement
    if (this.authService.currentUserValue) {
      this.router.navigate([this.returnUrl]);
    }
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
    
    if (!this.isLoginMode) {
      this.authForm.get('name')?.setValidators([Validators.required]);
    } else {
      this.authForm.get('name')?.clearValidators();
    }
    this.authForm.get('name')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.authForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const credentials = this.authForm.value;

    if (this.isLoginMode) {
      // Connexion
      this.authService.login({ email: credentials.email, password: credentials.password }).subscribe({
        next: () => {
          this.router.navigate([this.returnUrl]);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = "Email ou mot de passe incorrect.";
        }
      });
    } else {
      // Inscription (Simulation - on appellerait un this.authService.register)
      // Pour le MVP, si vous avez une route d'enregistrement dans Laravel, on l'appellera ici.
      this.errorMessage = "L'inscription sera câblée à Laravel dans la prochaine étape !";
      this.isLoading = false;
    }
  }
}
