import re

# Update AuthService
with open('src/app/core/services/auth.service.ts', 'r', encoding='utf-8') as f:
    auth_service = f.read()

register_method = '''
  /**
   * Inscrit l'utilisateur
   */
  register(credentials: any): Observable<User> {
    return this.csrfCookie().pipe(
      switchMap(() => this.http.post(${this.apiUrl}/api/v1/auth/register, credentials)),
      switchMap(() => this.checkAuthStatus())
    );
  }

'''

auth_service = auth_service.replace('  login(credentials: any): Observable<User> {', register_method + '  login(credentials: any): Observable<User> {')

with open('src/app/core/services/auth.service.ts', 'w', encoding='utf-8') as f:
    f.write(auth_service)

# Update LoginComponent
with open('src/app/features/auth/login.component.ts', 'r', encoding='utf-8') as f:
    login_comp = f.read()

old_register = '''      // Inscription (Simulation - on appellerait un this.authService.register)
      // Pour le MVP, si vous avez une route d'enregistrement dans Laravel, on l'appellera ici.
      this.errorMessage = "L'inscription sera c\u00e2bl\u00e9e \u00e0 Laravel dans la prochaine \u00e9tape !";
      this.isLoading = false;'''

new_register = '''      // Inscription
      this.authService.register({
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
        password_confirmation: credentials.password
      }).subscribe({
        next: () => {
          this.router.navigate([this.returnUrl]);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || "Une erreur est survenue lors de l'inscription.";
        }
      });'''

# Fix encoding issue if any (the script reads the exact string)
import sys

# Replace using regex because of encoding variations (c\u00e2bl\u00e9e vs cAblAe etc)
login_comp = re.sub(r'// Inscription \(Simulation.*this\.isLoading = false;', new_register, login_comp, flags=re.DOTALL)

with open('src/app/features/auth/login.component.ts', 'w', encoding='utf-8') as f:
    f.write(login_comp)

print("Updated both files.")
