import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Rendre Pusher global pour Echo
(window as any).Pusher = Pusher;

@Injectable({
  providedIn: 'root'
})
export class EchoService {
  private authService = inject(AuthService);
  private echo: Echo | null = null;

  initEcho() {
    if (this.echo) return;

    const token = this.authService.getToken();
    
    // Si l'utilisateur n'est pas connectÃ©, pas besoin d'Ã©couter les canaux privÃ©s
    if (!token) return;

    this.echo = new Echo({
      broadcaster: 'reverb',
      key: 'vide-dressing', // La clÃ© publique configurÃ©e dans le .env Laravel
      wsHost: '127.0.0.1',  // Si on dÃ©ploie, Ã§a sera le domaine rÃ©el
      wsPort: 8080,
      wssPort: 8080,
      forceTLS: false,      // false en local, true en prod
      enabledTransports: ['ws', 'wss'],
      authEndpoint: '/api/v1/broadcasting/auth', // L'endpoint d'authentification Laravel (Broadcast::routes)
      auth: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    });

    console.log('ðŸ”Œ Laravel Echo connectÃ© avec Reverb');
  }

  listenToConversation(conversationId: number, callback: (message: any) => void) {
    if (!this.echo) this.initEcho();
    
    if (this.echo) {
      console.log(`ðŸ”§ Ã‰coute du canal privÃ© : conversation.${conversationId}`);
      this.echo.private(`conversation.${conversationId}`)
        .listen('.message.sent', (e: any) => {
          callback(e);
        });
    }
  }

  leaveConversation(conversationId: number) {
    if (this.echo) {
      this.echo.leave(`conversation.${conversationId}`);
      console.log(`âŒ Fin de l'Ã©coute du canal privÃ© : conversation.${conversationId}`);
    }
  }
}
