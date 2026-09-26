import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CategoryService, Category, CategoryAttribute } from '../../core/services/category.service';
import { ListingService } from '../../core/services/listing.service';
import { forkJoin, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-create-listing',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="max-w-4xl mx-auto px-4 mb-20 animate-fade-in-up">
      <div class="mb-8 flex justify-between items-center">
        <a routerLink="/dashboard" class="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-watermelon-pink transition-colors flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Retour au tableau de bord
        </a>
      </div>

      <div class="glass-panel dark:bg-gray-900/80 dark:border-gray-700 p-8 md:p-12 relative overflow-hidden">
        <div class="absolute -top-10 -right-10 w-48 h-48 bg-watermelon-pink/10 rounded-full blur-2xl -z-10 animate-pulse-slow"></div>
        
        <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Déposer une annonce</h1>
        <p class="text-gray-500 dark:text-gray-400 mb-8">Vendez vos vêtements en quelques clics</p>

        <!-- Progress Bar -->
        <div class="flex justify-between items-center mb-10 relative">
            <div class="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-600 -z-10 -translate-y-1/2"></div>
            <div class="absolute top-1/2 left-0 h-1 bg-watermelon-pink -z-10 -translate-y-1/2 transition-all duration-500" [style.width]="((currentStep - 1) / 3 * 100) + '%'"></div>
            
            <div *ngFor="let step of [1,2,3,4]" class="flex flex-col items-center gap-2">
                <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300"
                     [ngClass]="currentStep >= step ? 'bg-watermelon-pink text-white shadow-lg shadow-watermelon-pink/30' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'">
                    {{ step }}
                </div>
            </div>
        </div>

        <form [formGroup]="form" class="space-y-8 min-h-[300px]">
          
          <!-- ÉTAPE 1 : CATÉGORIE -->
          <div *ngIf="currentStep === 1" class="space-y-6 animate-fade-in-right">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Que vendez-vous ?</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">Sélectionnez un univers</label>
                <select class="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-4 focus:ring-2 focus:ring-watermelon-pink/50 text-lg cursor-pointer" (change)="onParentCategoryChange($event)">
                  <option class="dark:bg-gray-800 dark:text-white" value="">Univers...</option>
                  <option *ngFor="let cat of categories" [value]="cat.id">{{ extractLocalString(cat.name) }}</option>
                </select>
              </div>
              <div *ngIf="selectedParentCategory?.children?.length" class="space-y-2 animate-fade-in-up">
                <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">Précisez la catégorie</label>
                <select formControlName="category_id" class="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-4 focus:ring-2 focus:ring-watermelon-pink/50 text-lg cursor-pointer" (change)="onChildCategoryChange()">
                  <option class="dark:bg-gray-800 dark:text-white" value="">Catégorie...</option>
                  <option *ngFor="let child of selectedParentCategory!.children" [value]="child.id">{{ extractLocalString(child.name) }}</option>
                </select>
              </div>
            </div>
          </div>

          <!-- ÉTAPE 2 : INFORMATIONS -->
          <div *ngIf="currentStep === 2" class="space-y-6 animate-fade-in-right">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Décrivez votre article</h2>
            
            <div class="space-y-2">
              <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">Titre de l'annonce</label>
              <input type="text" formControlName="title" placeholder="ex: Robe d'été fleurie Zara" class="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-4 focus:ring-2 focus:ring-watermelon-pink/50 text-lg">
            </div>

            <div class="space-y-2">
              <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">Description</label>
              <textarea formControlName="description" rows="4" placeholder="État, matière, raison de la vente..." class="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-watermelon-pink/50"></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">Prix (FCFA)</label>
                <input type="number" formControlName="price" placeholder="0.00" class="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-4 focus:ring-2 focus:ring-watermelon-pink/50 font-black text-xl text-watermelon-pink">
              </div>
              <div class="space-y-2">
                <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">État</label>
                <select formControlName="condition" class="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-4 focus:ring-2 focus:ring-watermelon-pink/50 text-lg cursor-pointer">
                  <option class="dark:bg-gray-800 dark:text-white" value="new">Neuf avec étiquette</option>
                  <option class="dark:bg-gray-800 dark:text-white" value="like_new">Très bon état</option>
                  <option class="dark:bg-gray-800 dark:text-white" value="good">Bon état</option>
                  <option class="dark:bg-gray-800 dark:text-white" value="fair">État satisfaisant</option>
                  <option class="dark:bg-gray-800 dark:text-white" value="poor">À rénover</option>
                </select>
              </div>
            </div>
          </div>

          <!-- ÉTAPE 3 : PHOTOS -->
          <div *ngIf="currentStep === 3" class="space-y-6 animate-fade-in-right">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Ajoutez des photos</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">Une belle photo augmente vos chances de vente par 3 !</p>

            <div 
              class="border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 relative overflow-hidden"
              [ngClass]="isDragging ? 'border-watermelon-pink bg-watermelon-pink/5 scale-[1.02]' : 'border-gray-300 dark:border-gray-500 bg-white/50 dark:bg-gray-800/50 hover:bg-gray-50 dark:bg-gray-700 hover:border-gray-400 dark:border-gray-400'"
              (dragover)="onDragOver($event)"
              (dragleave)="onDragLeave($event)"
              (drop)="onDrop($event)"
            >
              <input type="file" multiple accept="image/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" (change)="onFileSelected($event)">
              
              <div *ngIf="imagePreviews.length === 0" class="pointer-events-none">
                <div class="w-20 h-20 mx-auto bg-watermelon-pink/10 rounded-full flex items-center justify-center mb-4 text-watermelon-pink">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <p class="text-gray-900 dark:text-white font-bold text-xl">Glissez-déposez vos photos ici</p>
                <p class="text-md text-gray-500 dark:text-gray-400 mt-2">ou cliquez pour parcourir</p>
              </div>

              <!-- Prévisualisation des images -->
              <div *ngIf="imagePreviews.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-4 pointer-events-none relative z-20">
                <div *ngFor="let preview of imagePreviews; let i = index" class="relative group aspect-square rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-600">
                  <img [src]="preview" class="w-full h-full object-cover">
                  <!-- Bouton supprimer -->
                  <button type="button" (click)="removeImage(i, $event)" class="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg pointer-events-auto hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                
                <!-- Bouton d'ajout -->
                <div class="aspect-square rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-500 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 hover:text-watermelon-pink hover:border-watermelon-pink transition-colors cursor-pointer pointer-events-auto bg-white/50 dark:bg-gray-800/50">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                  <span class="text-sm font-bold">Ajouter</span>
                </div>
              </div>

            </div>
          </div>

          <!-- ÉTAPE 4 : ATTRIBUTS DYNAMIQUES -->
          <div *ngIf="currentStep === 4" class="space-y-6 animate-fade-in-right">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Détails spécifiques</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">Ces informations aideront les acheteurs à trouvéer votre article plus vite.</p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4" [formGroup]="attributesForm">
              <div *ngFor="let attr of dynamicAttributes" class="space-y-2">
                <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  {{ extractLocalString(attr.label) }} <span *ngIf="attr.is_required" class="text-red-500">*</span>
                </label>
                <select *ngIf="attr.type === 'select' || attr.type === 'multiselect'"
                  [multiple]="attr.type === 'multiselect'"
                  [class.h-32]="attr.type === 'multiselect'" [formControlName]="attr.id" class="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-4 focus:ring-2 focus:ring-watermelon-pink/50 text-lg cursor-pointer">
                  <option class="dark:bg-gray-800 dark:text-white" value="">Choisir...</option>
                  <option *ngFor="let opt of attr.options" [value]="opt.value">{{ extractLocalString(opt.label) }}</option>
                </select>
                <input *ngIf="attr.type === 'text'" type="text" [formControlName]="attr.id" class="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-4 focus:ring-2 focus:ring-watermelon-pink/50 text-lg">
              </div>
            </div>
            
            <div *ngIf="dynamicAttributes.length === 0" class="text-center p-8 bg-gray-50 dark:bg-gray-700 rounded-2xl border border-gray-100 dark:border-gray-700">
              <p class="text-gray-500 dark:text-gray-400">Aucun détail supplémentaire requis pour cette catégorie.</p>
            </div>
          </div>

          <!-- NAVIGATION WIZARD -->
          <div class="flex items-center justify-between pt-8 mt-8 border-t border-gray-100 dark:border-gray-700">
            <button type="button" *ngIf="currentStep > 1" (click)="currentStep = currentStep - 1" class="px-6 py-3 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-100 dark:bg-gray-700 rounded-xl transition-colors">
              Retour
            </button>
            <div *ngIf="currentStep === 1"></div> <!-- Spacer -->

            <button type="button" *ngIf="currentStep < 4" (click)="nextStep()" class="px-8 py-3 bg-gray-900 dark:bg-white dark:text-gray-900 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2">
              Continuer
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>

            <button type="submit" *ngIf="currentStep === 4" [disabled]="form.invalid || isSubmitting || selectedFiles.length === 0" (click)="onSubmit()" class="px-8 py-4 bg-gradient-to-r from-watermelon-pink to-watermelon-light text-white rounded-xl font-bold text-lg shadow-lg shadow-watermelon-pink/30 hover:shadow-watermelon-pink/50 hover:-translate-y-1 transition-all disabled:opacity-50 flex items-center gap-2">
              <span *ngIf="isSubmitting" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              {{ isSubmitting ? 'Publication...' : 'Publier mon annonce !' }}
            </button>
          </div>

        </form>
      </div>
    </div>
  `
})
export class CreateListingComponent implements OnInit {
  nextStep() {
    if (this.currentStep === 1 && !this.form.get('category_id')?.value) {
      alert("Veuillez sélectionner une catégorie.");
      return;
    }
    if (this.currentStep === 2) {
      if (!this.form.get('title')?.value || !this.form.get('price')?.value) {
        alert("Veuillez remplir le titre et le prix.");
        return;
      }
    }
    if (this.currentStep === 3 && this.selectedFiles.length === 0) {
      alert("Veuillez ajouter au moins une photo pour vendre plus vite !");
      return;
    }
    this.currentStep++;
  }

  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private listingService = inject(ListingService);
  private router = inject(Router);

  categories: Category[] = [];
  selectedParentCategory: Category | null = null;
  dynamicAttributes: CategoryAttribute[] = [];
  
  form: FormGroup;
  attributesForm: FormGroup;
  
  currentStep = 1;
  isSubmitting = false;
  isDragging = false;
  
  selectedFiles: File[] = [];
  imagePreviews: string[] = [];

  constructor() {
    this.attributesForm = this.fb.group({});
    this.form = this.fb.group({
      category_id: ['', Validators.required],
      title: ['', Validators.required],
      description: [''],
      price: ['', [Validators.required, Validators.min(0)]],
      condition: ['good', Validators.required],
      attributes: this.attributesForm
    });
  }

  ngOnInit() {
    this.categoryService.getCategories().subscribe(res => {
      this.categories = res;
    });
  }

  onParentCategoryChange(event: Event) {
    const parentId = +(event.target as HTMLSelectElement).value;
    this.selectedParentCategory = this.categories.find(c => c.id === parentId) || null;
    this.form.get('category_id')?.setValue('');
    this.resetAttributes();
  }

  onChildCategoryChange() {
    const childId = this.form.get('category_id')?.value;
    if (childId && this.selectedParentCategory) {
      this.categoryService.getAttributes(this.selectedParentCategory.id).subscribe(attrs => {
        this.dynamicAttributes = attrs;
        this.buildAttributesForm(attrs);
      });
    } else {
      this.resetAttributes();
    }
  }

  buildAttributesForm(attrs: CategoryAttribute[]) {
    this.attributesForm = this.fb.group({});
    attrs.forEach(attr => {
      const validators = attr.is_required ? [Validators.required] : [];
      this.attributesForm.addControl(attr.id.toString(), new FormControl('', validators));
    });
    this.form.setControl('attributes', this.attributesForm);
  }

  resetAttributes() {
    this.dynamicAttributes = [];
    this.attributesForm = this.fb.group({});
    this.form.setControl('attributes', this.attributesForm);
  }

  // --- DRAG & DROP LOGIQUE ---
  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }
  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    if (event.dataTransfer?.files) {
      this.handleFiles(Array.from(event.dataTransfer.files));
    }
  }
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(Array.from(input.files));
    }
  }
  handleFiles(files: File[]) {
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        this.selectedFiles.push(file);
        const reader = new FileReader();
        reader.onload = (e: any) => this.imagePreviews.push(e.target.result);
        reader.readAsDataURL(file);
      }
    });
  }
  removeImage(index: number, event: Event) {
    event.stopPropagation();
    this.selectedFiles.splice(index, 1);
    this.imagePreviews.splice(index, 1);
  }

  onSubmit() {
    if (this.form.invalid || this.selectedFiles.length === 0) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formValue = this.form.value;

    const payload = new FormData();
    payload.append('category_id', formValue.category_id);
    payload.append('price', formValue.price);
    payload.append('condition', formValue.condition);
    payload.append('currency', 'XOF');
    payload.append('title[fr]', formValue.title);
    if (formValue.description) {
      payload.append('description[fr]', formValue.description);
    }

    Object.keys(formValue.attributes).forEach(attrId => {
      if (formValue.attributes[attrId]) {
        payload.append(`attributes[${attrId}]`, formValue.attributes[attrId]);
      }
    });

    // Tunnel : Création brouillon -> Uploads (parallèle) -> Publication
    this.listingService.createListing(payload).pipe(
      switchMap(res => {
        const listingId = res.id || res.data?.id; // Dépend du format de réponse
        if (!listingId) throw new Error("ID d'annonce introuvéable");
        
        const uploadRequests = this.selectedFiles.map(file => 
          this.listingService.uploadImage(listingId, file)
        );

        return forkJoin(uploadRequests).pipe(
          switchMap(() => this.listingService.publishListing(listingId)),
          tap(() => listingId)
        );
      })
    ).subscribe({
      next: (publishedListing: any) => {
        this.isSubmitting = false;
        const finalId = publishedListing.id || publishedListing.data?.id;
        this.router.navigate(['/listing', finalId]);
      },
      error: (err) => {
        console.error(err);
        this.isSubmitting = false;
        alert("Erreur lors de la création ou de l'upload des images.");
      }
    });
  }

  extractLocalString(field: any): string {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field['fr'] || field['en'] || Object.values(field)[0] || '';
  }
}
