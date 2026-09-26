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
<div class="min-h-[80vh] flex py-12 px-4 sm:px-6 lg:px-8 relative z-10 max-w-6xl mx-auto gap-8 items-center justify-center">

  <!-- Section Image (Cachée sur mobile) -->
  <div class="hidden md:flex flex-col flex-1 max-w-lg items-center justify-center text-center space-y-6">
    <div class="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl group">
      <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000" alt="Dressing Mode Africaine" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
      <div class="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent flex items-end p-8">
        <div class="text-left text-white">
          <h2 class="text-3xl font-extrabold mb-2">Rejoignez VideDressing SN</h2>
          <p class="text-gray-200">Achetez et vendez vos articles de mode partout au Sénégal.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Formulaire existant -->
  <div class="flex-1 max-w-md w-full">
    <div class="glass-panel p-8 md:p-10 relative overflow-hidden">
        <div class="absolute -top-10 -right-10 w-40 h-40 bg-watermelon-pink/20 rounded-full blur-2xl -z-10 animate-pulse-slow"></div>
        <div class="absolute -bottom-10 -left-10 w-40 h-40 bg-watermelon-light/20 rounded-full blur-2xl -z-10 animate-pulse-slow"></div>

        <div class="text-center mb-10">
          <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
            {{ isLoginMode ? 'Bon retour !' : 'Créez un compte' }}
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ isLoginMode ? 'Connectez-vous pour continuer' : 'Rejoignez la communauté en quelques secondes' }}
          </p>
        </div>

        <!-- Message de succès -->
        <div *ngIf="successMessage" class="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm font-medium flex items-center gap-3">
          ✅ {{ successMessage }}
        </div>

        <!-- Messages d'erreur -->
        <div *ngIf="errorMessage" class="mb-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-xl text-sm font-medium border border-red-200 dark:border-red-800 shadow-sm flex items-start gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          {{ errorMessage }}
        </div>

        <!-- Formulaire principal -->
        <form *ngIf="step === 1" [formGroup]="authForm" class="space-y-5">
          <!-- Champ Nom -->
          <div *ngIf="!isLoginMode" class="space-y-1 animate-fade-in-up">
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200">Nom complet</label>
            <input type="text" formControlName="name" placeholder="Prénom Nom" class="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-watermelon-pink/50 focus:bg-gray-50 dark:focus:bg-gray-700 transition-all shadow-sm">
          </div>

          <!-- Champ Email -->
          <div *ngIf="!isLoginMode" class="space-y-1 animate-fade-in-up">
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200">Adresse e-mail (optionnelle)</label>
            <input type="email" formControlName="email" placeholder="vous@exemple.com" class="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-watermelon-pink/50 focus:bg-gray-50 dark:focus:bg-gray-700 transition-all shadow-sm">
          </div>

          <!-- Champ Téléphone -->
          <div class="space-y-1 animate-fade-in-up">
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200">Numéro de téléphone</label>
            <div class="relative">
              <input type="tel" formControlName="phone" placeholder="+221771234567" class="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-watermelon-pink/50 focus:bg-gray-50 dark:focus:bg-gray-700 transition-all shadow-sm pl-12">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              </div>
            </div>
          </div>

          <!-- Champ Mot de passe -->
          <div class="space-y-1 animate-fade-in-up">
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200">Mot de passe</label>
            <div class="relative">
              <input type="password" formControlName="password" placeholder="••••••••" class="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-watermelon-pink/50 focus:bg-gray-50 dark:focus:bg-gray-700 transition-all shadow-sm pl-12">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
            </div>
          </div>

          <!-- Bouton -->
          <button type="button" (click)="onSubmitStep1()" [disabled]="authForm.invalid || isLoading" class="w-full py-3.5 bg-gradient-to-r from-watermelon-pink to-watermelon-light text-white rounded-xl font-bold shadow-lg hover:shadow-watermelon-pink/40 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-2">
            <span *ngIf="isLoading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            {{ isLoginMode ? 'Se connecter' : 'Créer mon compte' }}
          </button>
        </form>

        <!-- Etape 2: Code OTP -->
        <form *ngIf="step === 2" [formGroup]="otpForm" (ngSubmit)="onSubmitStep2()" class="space-y-5 animate-fade-in-up">
          <div class="space-y-1 text-center">
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Code à 6 chiffres</label>
            <input type="text" formControlName="code" placeholder="123456" maxlength="6" class="w-full text-center tracking-[0.5em] text-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-watermelon-pink/50 focus:bg-gray-50 dark:focus:bg-gray-700 transition-all shadow-sm">
          </div>
          <button type="submit" [disabled]="otpForm.invalid || isLoading" class="w-full py-3.5 mt-2 bg-gradient-to-r from-watermelon-pink to-watermelon-light text-white rounded-xl font-bold shadow-lg hover:shadow-watermelon-pink/40 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex justify-center items-center gap-2">
            <span *ngIf="isLoading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            Vérifier le code
          </button>
        </form>

        <!-- Toggle Mode -->
        <div class="mt-8 text-center" *ngIf="step === 1">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ isLoginMode ? 'Pas encore de compte ?' : 'Déjà inscrit ?' }}
            <button (click)="toggleMode()" class="ml-1 text-watermelon-pink font-bold hover:underline focus:outline-none">
              {{ isLoginMode ? 'Créer un compte' : 'Se connecter' }}
            </button>
          </p>
        </div>
    </div>
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
  otpForm: FormGroup;
  
  isLoginMode = true;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;
  returnUrl = '/';
  step = 1; // 1: Phone, 2: OTP

  constructor() {
    this.authForm = this.fb.group({
      phone: ['', [Validators.required, Validators.minLength(8)]],
      name: [''],
      email: ['', [Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.otpForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    
    if (this.authService.currentUserValue) {
      this.router.navigate([this.returnUrl]);
    }
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
    this.successMessage = '';
    this.authForm.reset();
    
    if (!this.isLoginMode) {
      this.authForm.get('name')?.setValidators([Validators.required]);
    } else {
      this.authForm.get('name')?.clearValidators();
    }
    this.authForm.get('name')?.updateValueAndValidity();
  }

  goBack() {
    this.step = 1;
    this.errorMessage = '';
    this.successMessage = '';
    this.otpForm.reset();
  }

  onSubmitStep1() {
    if (this.authForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const credentials = this.authForm.value;

    if (this.isLoginMode) {
      this.authService.login({ phone: credentials.phone, password: credentials.password }).subscribe({
        next: () => {
          this.router.navigate([this.returnUrl]);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || "Numéro de téléphone ou mot de passe incorrect.";
        }
      });
    } else {
      this.authService.register({
        name: credentials.name,
        phone: credentials.phone,
        email: credentials.email
      }).subscribe({
        next: () => {
          this.isLoading = false;
          // Si l'inscription ne connecte pas automatiquement et renvoie un OTP
          this.step = 2;
          this.successMessage = "Code envoyé avec succès ! (15)";
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || "Erreur lors de l'inscription.";
        }
      });
    }
  }

  onSubmitStep2() {
    if (this.otpForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const phone = this.authForm.value.phone;
    const code = this.otpForm.value.code;

    this.authService.verifyOtp(phone, code).subscribe({
      next: () => {
        this.router.navigate([this.returnUrl]);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || "Code invalide ou expiré.";
      }
    });
  }
}



