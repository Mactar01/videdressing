import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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
      <div class="mb-8">
        <a routerLink="/dashboard" class="text-sm font-medium text-gray-500 hover:text-watermelon-pink transition-colors flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Retour au tableau de bord
        </a>
      </div>

      <div class="glass-panel p-8 md:p-12 relative">
        <div class="absolute -top-10 -right-10 w-48 h-48 bg-watermelon-pink/10 rounded-full blur-2xl -z-10 animate-pulse-slow"></div>
        
        <h1 class="text-3xl font-extrabold text-gray-900 mb-8">Déposer une annonce</h1>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-10">
          
          <!-- ÉTAPE 1 : CATÉGORIE -->
          <div class="space-y-4">
            <h2 class="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
              <span class="w-8 h-8 rounded-full bg-watermelon-pink text-white flex items-center justify-center text-sm">1</span>
              Univers
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <select class="w-full bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-watermelon-pink/50" (change)="onParentCategoryChange($event)">
                  <option value="">Sélectionnez un univers...</option>
                  <option *ngFor="let cat of categories" [value]="cat.id">{{ extractLocalString(cat.name) }}</option>
                </select>
              </div>
              <div *ngIf="selectedParentCategory?.children?.length">
                <select formControlName="category_id" class="w-full bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-watermelon-pink/50" (change)="onChildCategoryChange()">
                  <option value="">Précisez...</option>
                  <option *ngFor="let child of selectedParentCategory!.children" [value]="child.id">{{ extractLocalString(child.name) }}</option>
                </select>
              </div>
            </div>
          </div>

          <!-- ÉTAPE 2 : INFORMATIONS -->
          <div class="space-y-4 animate-fade-in-up" *ngIf="form.get('category_id')?.value">
            <h2 class="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
              <span class="w-8 h-8 rounded-full bg-watermelon-pink text-white flex items-center justify-center text-sm">2</span>
              Informations
            </h2>
            
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">Titre de l'annonce</label>
              <input type="text" formControlName="title" placeholder="Ex: Canapé vintage en velours..." class="w-full bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-watermelon-pink/50">
            </div>

            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">Description</label>
              <textarea formControlName="description" rows="4" placeholder="Détaillez l'état..." class="w-full bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-watermelon-pink/50"></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700">Prix (€)</label>
                <input type="number" formControlName="price" placeholder="0.00" class="w-full bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-watermelon-pink/50 font-black text-lg text-watermelon-pink">
              </div>
              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700">État</label>
                <select formControlName="condition" class="w-full bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-watermelon-pink/50">
                  <option value="new">Neuf</option>
                  <option value="like_new">Très bon état</option>
                  <option value="good">Bon état</option>
                  <option value="fair">État satisfaisant</option>
                  <option value="poor">À rénover</option>
                </select>
              </div>
            </div>
          </div>

          <!-- ÉTAPE 3 : PHOTOS (DRAG & DROP) -->
          <div class="space-y-4 animate-fade-in-up" *ngIf="form.get('category_id')?.value">
            <h2 class="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
              <span class="w-8 h-8 rounded-full bg-watermelon-pink text-white flex items-center justify-center text-sm">3</span>
              Photos
            </h2>

            <div 
              class="border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 relative overflow-hidden"
              [ngClass]="isDragging ? 'border-watermelon-pink bg-watermelon-pink/5 scale-[1.02]' : 'border-gray-300 bg-white/50 hover:bg-gray-50'"
              (dragover)="onDragOver($event)"
              (dragleave)="onDragLeave($event)"
              (drop)="onDrop($event)"
            >
              <input type="file" multiple accept="image/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" (change)="onFileSelected($event)">
              
              <div *ngIf="imagePreviews.length === 0" class="pointer-events-none">
                <div class="w-16 h-16 mx-auto bg-watermelon-pink/10 rounded-full flex items-center justify-center mb-4 text-watermelon-pink">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <p class="text-gray-700 font-bold text-lg">Glissez-déposez vos photos ici</p>
                <p class="text-sm text-gray-500 mt-1">ou cliquez pour parcourir</p>
              </div>

              <!-- Prévisualisation des images -->
              <div *ngIf="imagePreviews.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-4 pointer-events-none relative z-20">
                <div *ngFor="let preview of imagePreviews; let i = index" class="relative group aspect-square rounded-xl overflow-hidden shadow-sm border border-gray-200">
                  <img [src]="preview" class="w-full h-full object-cover">
                  <!-- Bouton supprimer -->
                  <button type="button" (click)="removeImage(i, $event)" class="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg pointer-events-auto hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                
                <!-- Bouton d'ajout supplémentaire -->
                <div class="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 hover:text-watermelon-pink hover:border-watermelon-pink transition-colors cursor-pointer pointer-events-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                  <span class="text-xs font-bold">Ajouter</span>
                </div>
              </div>

            </div>
          </div>

          <!-- ÉTAPE 4 : ATTRIBUTS DYNAMIQUES -->
          <div class="space-y-4 animate-fade-in-up" *ngIf="dynamicAttributes.length > 0">
            <h2 class="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
              <span class="w-8 h-8 rounded-full bg-watermelon-pink text-white flex items-center justify-center text-sm">4</span>
              Détails spécifiques
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4" [formGroup]="attributesForm">
              <div *ngFor="let attr of dynamicAttributes" class="space-y-1">
                <label class="block text-sm font-medium text-gray-700">
                  {{ extractLocalString(attr.label) }} <span *ngIf="attr.is_required" class="text-red-500">*</span>
                </label>
                <select *ngIf="attr.type === 'select'" [formControlName]="attr.id" class="w-full bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-watermelon-pink/50">
                  <option value="">Choisir...</option>
                  <option *ngFor="let opt of attr.options" [value]="opt.value">{{ extractLocalString(opt.label) }}</option>
                </select>
                <input *ngIf="attr.type === 'text'" type="text" [formControlName]="attr.id" class="w-full bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-watermelon-pink/50">
              </div>
            </div>
          </div>

          <!-- SUBMIT -->
          <div class="pt-6" *ngIf="form.get('category_id')?.value">
            <button type="submit" [disabled]="form.invalid || isSubmitting || selectedFiles.length === 0" class="w-full py-4 bg-gradient-to-r from-watermelon-pink to-watermelon-light text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-watermelon-pink/40 hover:-translate-y-1 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              <span *ngIf="isSubmitting" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              {{ isSubmitting ? 'Publication en cours...' : 'Publier mon annonce' }}
            </button>
            <p *ngIf="selectedFiles.length === 0" class="text-center text-xs text-red-500 mt-2">Veuillez ajouter au moins une photo.</p>
          </div>

        </form>
      </div>
    </div>
  `
})
export class CreateListingComponent implements OnInit {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private listingService = inject(ListingService);
  private router = inject(Router);

  categories: Category[] = [];
  selectedParentCategory: Category | null = null;
  dynamicAttributes: CategoryAttribute[] = [];
  
  form: FormGroup;
  attributesForm: FormGroup;
  
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
    payload.append('currency', 'EUR');
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
        if (!listingId) throw new Error("ID d'annonce introuvable");
        
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
