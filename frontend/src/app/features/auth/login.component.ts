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
            {{ step === 1 ? (isLoginMode ? 'Connectez-vous pour continuer sur VideDressing.' : 'Créez un compte pour vendre et acheter.') : 'Entrez le code reçu par SMS.' }}
          </p>
        </div>

        <!-- Messages d'erreur -->
        <div *ngIf="errorMessage" class="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 flex items-start gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          {{ errorMessage }}
        </div>

        <!-- Etape 1: Formulaire Téléphone -->
        <form *ngIf="step === 1" [formGroup]="authForm" (ngSubmit)="onSubmitStep1()" class="space-y-5">
          
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

          <!-- Champ Email (Optionnel, uniquement pour inscription) -->
          <div *ngIf="!isLoginMode" class="space-y-1 animate-fade-in-up">
            <label class="block text-sm font-semibold text-gray-700">Adresse e-mail (optionnelle)</label>
            <input 
              type="email" 
              formControlName="email"
              placeholder="vous@exemple.com"
              class="w-full bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-watermelon-pink/50 focus:bg-white transition-all shadow-sm"
            >
          </div>

          <!-- Champ Téléphone -->
          <div class="space-y-1">
            <label class="block text-sm font-semibold text-gray-700">Numéro de téléphone</label>
            <input 
              type="tel" 
              formControlName="phone"
              placeholder="+33 6 12 34 56 78"
              class="w-full bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-watermelon-pink/50 focus:bg-white transition-all shadow-sm"
            >
          </div>

          <!-- Bouton Soumettre -->
          <button 
            type="submit" 
            [disabled]="authForm.invalid || isLoading"
            class="w-full py-3.5 mt-2 bg-gradient-to-r from-watermelon-pink to-watermelon-light text-white rounded-xl font-bold shadow-lg hover:shadow-watermelon-pink/40 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center gap-2"
          >
            <span *ngIf="isLoading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            {{ isLoginMode ? 'Recevoir le code' : 'S\\'inscrire et recevoir le code' }}
          </button>
        </form>

        <!-- Etape 2: Code OTP -->
        <form *ngIf="step === 2" [formGroup]="otpForm" (ngSubmit)="onSubmitStep2()" class="space-y-5 animate-fade-in-up">
          <div class="space-y-1 text-center">
            <label class="block text-sm font-semibold text-gray-700 mb-4">Code à 6 chiffres</label>
            <input 
              type="text" 
              formControlName="code"
              placeholder="123456"
              maxlength="6"
              class="w-full text-center tracking-[0.5em] text-2xl bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-watermelon-pink/50 focus:bg-white transition-all shadow-sm"
            >
          </div>

          <!-- Bouton Soumettre OTP -->
          <button 
            type="submit" 
            [disabled]="otpForm.invalid || isLoading"
            class="w-full py-3.5 mt-2 bg-gradient-to-r from-watermelon-pink to-watermelon-light text-white rounded-xl font-bold shadow-lg hover:shadow-watermelon-pink/40 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center gap-2"
          >
            <span *ngIf="isLoading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            Vérifier le code
          </button>
          
          <button 
            type="button"
            (click)="goBack()"
            class="w-full py-2 mt-2 text-gray-500 text-sm font-medium hover:text-gray-800 transition-colors"
          >
            Retour
          </button>
        </form>

        <!-- Toggle Mode -->
        <p *ngIf="step === 1" class="mt-8 text-center text-sm text-gray-600">
          {{ isLoginMode ? 'Nouveau sur VideDressing ?' : 'Déjà un compte ?' }}
          <button type="button" (click)="toggleMode()" class="text-watermelon-pink font-bold hover:underline focus:outline-none ml-1">
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
  otpForm: FormGroup;
  
  isLoginMode = true;
  isLoading = false;
  errorMessage = '';
  returnUrl = '/';
  step = 1; // 1: Phone, 2: OTP

  constructor() {
    this.authForm = this.fb.group({
      phone: ['', [Validators.required, Validators.minLength(8)]],
      name: [''],
      email: ['', [Validators.email]]
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
    this.otpForm.reset();
  }

  onSubmitStep1() {
    if (this.authForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const credentials = this.authForm.value;

    if (this.isLoginMode) {
      this.authService.sendOtp(credentials.phone).subscribe({
        next: () => {
          this.isLoading = false;
          this.step = 2;
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || "Erreur lors de l'envoi du code.";
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
