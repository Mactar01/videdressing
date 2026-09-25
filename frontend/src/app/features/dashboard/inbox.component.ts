import { Component, OnInit, inject, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageService, Conversation, Message } from '../../core/services/message.service';
import { AuthService } from '../../core/services/auth.service';
import { timer, Subscription } from 'rxjs';
import { EchoService } from '../../core/services/echo.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="max-w-6xl mx-auto px-4 mb-10 h-[80vh] flex gap-6">
      
      <!-- Colonne de gauche : Liste des conversations -->
      <div class="w-1/3 bg-white/70 backdrop-blur-md border border-gray-200 rounded-3xl overflow-hidden flex flex-col shadow-sm" [ngClass]="{'hidden md:flex': activeConversationId}">
        <div class="p-5 border-b border-gray-100 bg-white/50">
          <h2 class="text-xl font-extrabold text-gray-900">Messagerie</h2>
        </div>
        
        <div class="flex-1 overflow-y-auto">
          <div *ngIf="conversations.length === 0" class="p-8 text-center text-gray-500 text-sm">
            Vous n'avez aucune conversation.
          </div>
          
          <a *ngFor="let conv of conversations" 
             [routerLink]="['/dashboard/inbox', conv.id]"
             class="flex items-center gap-4 p-4 border-b border-gray-50 hover:bg-watermelon-pink/5 cursor-pointer transition-colors"
             [ngClass]="{'bg-watermelon-pink/10 border-l-4 border-l-watermelon-pink': conv.id === activeConversationId}">
            
            <div class="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
              <img [src]="getOtherUser(conv).avatar || 'https://ui-avatars.com/api/?name=' + getOtherUser(conv).name + '&background=random'" class="w-full h-full object-cover">
            </div>
            
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-bold text-gray-900 truncate">{{ getOtherUser(conv).name }}</h3>
              <p class="text-xs text-gray-500 truncate">{{ extractLocalString(conv.listing.title) }}</p>
            </div>
          </a>
        </div>
      </div>

      <!-- Colonne de droite : Chat actif -->
      <div class="flex-1 bg-white/70 backdrop-blur-md border border-gray-200 rounded-3xl overflow-hidden flex flex-col shadow-sm relative" [ngClass]="{'hidden md:flex': !activeConversationId}">
        
        <ng-container *ngIf="activeConversationId && activeConversation; else noSelection">
          <!-- Header du chat -->
          <div class="p-4 border-b border-gray-100 bg-white/80 flex items-center gap-4 z-10">
            <button routerLink="/dashboard/inbox" class="md:hidden p-2 text-gray-500 hover:text-watermelon-pink">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div class="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
              <img [src]="getOtherUser(activeConversation).avatar || 'https://ui-avatars.com/api/?name=' + getOtherUser(activeConversation).name + '&background=random'" class="w-full h-full object-cover">
            </div>
            <div>
              <h3 class="font-bold text-gray-900">{{ getOtherUser(activeConversation).name }}</h3>
              <a [routerLink]="['/listing', activeConversation.listing.id]" class="text-xs text-watermelon-pink hover:underline truncate max-w-xs block">
                {{ extractLocalString(activeConversation.listing.title) }} - {{ activeConversation.listing.price }}â‚¬
              </a>
            </div>
          </div>

          <!-- Messages -->
          <div class="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50" #scrollMe>
            <div *ngFor="let msg of messages" class="flex flex-col" [ngClass]="{'items-end': msg.sender_id === currentUserId, 'items-start': msg.sender_id !== currentUserId}">
              <div 
                class="max-w-[75%] px-5 py-3 rounded-2xl text-sm shadow-sm"
                [ngClass]="msg.sender_id === currentUserId ? 'bg-gradient-to-br from-watermelon-pink to-watermelon-light text-white rounded-br-none' : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'">
                {{ msg.body }}
              </div>
              <span class="text-[10px] text-gray-400 mt-1 mx-1">
                {{ msg.created_at | date:'shortTime' }}
              </span>
            </div>
          </div>

          <!-- Input area -->
          <div class="p-4 bg-white border-t border-gray-100">
            <form (ngSubmit)="sendMessage()" class="flex gap-2 relative">
              <input 
                type="text" 
                [(ngModel)]="newMessage" 
                name="message" 
                placeholder="Ã‰crivez un message..." 
                class="flex-1 bg-gray-100 border-transparent rounded-full px-6 py-3 focus:bg-white focus:ring-2 focus:ring-watermelon-pink/50 focus:border-transparent transition-all outline-none"
                autocomplete="off"
              >
              <button 
                type="submit" 
                [disabled]="!newMessage.trim() || isSending"
                class="w-12 h-12 bg-watermelon-pink text-white rounded-full flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </form>
          </div>
        </ng-container>

        <ng-template #noSelection>
          <div class="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
            <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            </div>
            <h3 class="text-xl font-bold text-gray-700 mb-2">Vos messages</h3>
            <p class="text-sm">SÃ©lectionnez une conversation sur la gauche pour commencer Ã  discuter.</p>
          </div>
        </ng-template>

      </div>
    </div>
  `
})
export class InboxComponent implements OnInit, OnDestroy {
  private messageService = inject(MessageService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private echoService = inject(EchoService);

  conversations: Conversation[] = [];
  messages: Message[] = [];
  activeConversationId: number | null = null;
  activeConversation: Conversation | null = null;
  
  currentUserId: number = 0;
  newMessage = '';
  isSending = false;

  private pollSubscription?: Subscription;
  @ViewChild('scrollMe') private myScrollContainer?: ElementRef;

  ngOnInit() {
    this.currentUserId = this.authService.currentUserValue?.id || 0;

    // Charger les conversations
    this.loadConversations();

    // Ecouter les changements d'URL pour charger la conversation active
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.activeConversationId = +id;
        this.loadActiveConversation();
        this.startPolling();
      } else {
        this.activeConversationId = null;
        this.activeConversation = null;
        this.stopPolling();
      }
    });
  }

  ngOnDestroy() {
    this.stopPolling();
  }

  loadConversations() {
    this.messageService.getConversations().subscribe(res => {
      this.conversations = res.data;
    });
  }

  loadActiveConversation() {
    this.activeConversation = this.conversations.find(c => c.id === this.activeConversationId) || null;
    if (this.activeConversationId) {
      this.messageService.getMessages(this.activeConversationId).subscribe(res => {
        this.messages = res.data;
        this.scrollToBottom();
      });
    }
  }

  startPolling() {
    this.stopPolling();
    // Ã‰coute temps rÃ©el via Reverb
    this.echoService.listenToConversation(this.activeConversationId!, (event) => {
      // Ignorer si le message vient de nous-mÃªme (dÃ©jÃ  affichÃ© via l'ajout optimiste)
      if (event.sender_id !== this.currentUserId) {
        this.messages.push({
          id: event.id,
          conversation_id: event.conversation_id,
          sender_id: event.sender_id,
          body: event.body,
          attachments: event.attachments,
          created_at: event.created_at,
          read_at: event.read_at
        } as any);
        this.scrollToBottom();
        this.loadConversations();
      }
    });
  }

  stopPolling() {
    if (this.activeConversationId) {
      this.echoService.leaveConversation(this.activeConversationId);
    }
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.activeConversationId) return;
    
    this.isSending = true;
    const body = this.newMessage;
    this.newMessage = ''; // Reset optimiste
    
    this.messageService.sendMessage(this.activeConversationId, body).subscribe({
      next: (msg) => {
        this.messages.push(msg);
        this.isSending = false;
        this.scrollToBottom();
        // Optionnel : remonter la conversation dans la liste de gauche
        this.loadConversations();
      },
      error: () => {
        this.isSending = false;
        this.newMessage = body; // Restaurer en cas d'erreur
      }
    });
  }

  getOtherUser(conv: Conversation) {
    return conv.buyer_id === this.currentUserId ? conv.seller : conv.buyer;
  }

  extractLocalString(field: any): string {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field['fr'] || field['en'] || Object.values(field)[0] || '';
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      try {
        if (this.myScrollContainer) {
          this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        }
      } catch(e: any) { }
    }, 100);
  }
}

