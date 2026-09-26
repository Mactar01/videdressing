import { Component, inject, signal, OnInit, HostListener, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { RouterModule, RouterOutlet, Router, Event, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, ActivatedRoute } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('frontend');
  public authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);

  isDarkMode = false;
  showCookies = false;
  showBackToTop = false;
  isLoading = false;
  scrollProgress = 0;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const savedMode = localStorage.getItem('theme');
      if (savedMode === 'dark' || (!savedMode && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        this.toggleDarkMode(true);
      }
      
      if (!localStorage.getItem('cookiesAccepted')) {
        this.showCookies = true;
      }

      this.route.queryParams.subscribe(params => {
        const utmSource = params['utm_source'];
        const utmMedium = params['utm_medium'];
        const utmCampaign = params['utm_campaign'];
        if (utmSource || utmMedium || utmCampaign) {
          localStorage.setItem('utm_data', JSON.stringify({ source: utmSource, medium: utmMedium, campaign: utmCampaign }));
        }
      });
    }

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.isLoading = true;
        this.cdr.detectChanges();
      }
      if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        if (isPlatformBrowser(this.platformId)) {
          setTimeout(() => {
            this.isLoading = false;
            this.cdr.detectChanges();
          }, 500); 
        } else {
          this.isLoading = false;
        }
      }
    });
  }

  toggleDarkMode(force?: boolean) {
    this.isDarkMode = force !== undefined ? force : !this.isDarkMode;
    if (isPlatformBrowser(this.platformId)) {
      if (this.isDarkMode) {
        this.document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        this.document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }
  }

  acceptCookies() {
    this.showCookies = false;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('cookiesAccepted', 'true');
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      this.scrollProgress = height > 0 ? (winScroll / height) * 100 : 0;
      this.showBackToTop = winScroll > 300;
    }
  }

  scrollToTop() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  onSearch(query: string) {
    if (query.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: query.trim() } });
    }
  }

  logout() { 
    if (isPlatformBrowser(this.platformId)) {
      if(confirm('Voulez-vous vraiment vous déconnecter ? (17)')) { 
        this.authService.logout().subscribe(); 
      }
    } else {
      this.authService.logout().subscribe();
    }
  }

  openContact() {
    if (isPlatformBrowser(this.platformId)) {
      alert("Ouverture du formulaire de contact !");
    }
  }
}
