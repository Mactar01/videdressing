import os
import re

p = 'frontend/src/app/features/dashboard/create-listing.component.ts'
with open(p, 'r', encoding='utf-8') as f:
    c = f.read()

# Make buttons uniform
c = c.replace('px-6 py-3 text-gray-600', 'px-8 py-4 text-lg text-gray-600')
c = c.replace('px-8 py-3 bg-gray-900', 'px-8 py-4 text-lg bg-gray-900')

# Replace alert() with Swal.fire() in nextStep
old_nextstep = """    nextStep() {
      if (this.currentStep === 1 && !this.form.get('category_id')?.value) {
        alert("Veuillez sÃ©lectionner une catÃ©gorie.");
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
    }"""

# Handle potential mojibake in original string
import re

def swal_replace(match):
    return """    nextStep() {
      if (this.currentStep === 1 && !this.form.get('category_id')?.value) {
        Swal.fire({icon: 'warning', title: 'Oups...', text: 'Veuillez sélectionner une catégorie.', confirmButtonColor: '#f43f5e'});
        return;
      }
      if (this.currentStep === 2) {
        if (!this.form.get('title')?.value || !this.form.get('price')?.value) {
          Swal.fire({icon: 'warning', title: 'Attention', text: 'Veuillez remplir le titre et le prix.', confirmButtonColor: '#f43f5e'});
          return;
        }
      }
      if (this.currentStep === 3 && this.selectedFiles.length === 0) {
        Swal.fire({icon: 'warning', title: 'Photo manquante', text: 'Veuillez ajouter au moins une photo pour vendre plus vite !', confirmButtonColor: '#f43f5e'});
        return;
      }
      this.currentStep++;
    }"""

c = re.sub(r'    nextStep\(\) \{[\s\S]*?this\.currentStep\+\+;\n    \}', swal_replace, c)

with open(p, 'w', encoding='utf-8') as f:
    f.write(c)
