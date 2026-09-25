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
  private echo: any | null = null;

  initEcho() {
    if (this.echo) return;

    const token = localStorage.getItem('token');
    
    // Si l'utilisateur n'est pas connectÃƒÂ©, pas besoin d'ÃƒÂ©couter les canaux privÃƒÂ©s
    if (!token) return;

    this.echo = new Echo({
      broadcaster: 'reverb',
      key: 'vide-dressing', // La clÃƒÂ© publique configurÃƒÂ©e dans le .env Laravel
      wsHost: '127.0.0.1',  // Si on dÃƒÂ©ploie, ÃƒÂ§a sera le domaine rÃƒÂ©el
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

    console.log('Ã°Å¸â€Å’ Laravel Echo connectÃƒÂ© avec Reverb');
  }

  listenToConversation(conversationId: number, callback: (message: any) => void) {
    if (!this.echo) this.initEcho();
    
    if (this.echo) {
      console.log(`Ã°Å¸â€Â§ Ãƒâ€°coute du canal privÃƒÂ© : conversation.${conversationId}`);
      this.echo.private(`conversation.${conversationId}`)
        .listen('.message.sent', (e: any) => {
          callback(e);
        });
    }
  }

  leaveConversation(conversationId: number) {
    if (this.echo) {
      this.echo.leave(`conversation.${conversationId}`);
      console.log(`Ã¢ÂÅ’ Fin de l'ÃƒÂ©coute du canal privÃƒÂ© : conversation.${conversationId}`);
    }
  }
}
