import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Conversation {
  id: number;
  listing_id: number;
  buyer_id: number;
  seller_id: number;
  last_message_at: string;
  listing: any;
  buyer: any;
  seller: any;
}

export interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  body: string;
  created_at: string;
  sender: any;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/conversations';

  /**
   * Crée une conversation à partir d'une annonce
   */
  startConversation(listingId: number): Observable<Conversation> {
    return this.http.post<Conversation>(this.apiUrl, { listing_id: listingId });
  }

  /**
   * Liste toutes mes conversations actives
   */
  getConversations(): Observable<{data: Conversation[]}> {
    return this.http.get<{data: Conversation[]}>(this.apiUrl);
  }

  /**
   * Récupère les messages d'une conversation spécifique
   */
  getMessages(conversationId: number): Observable<{data: Message[]}> {
    return this.http.get<{data: Message[]}>(`${this.apiUrl}/${conversationId}/messages`);
  }

  /**
   * Envoie un message texte
   */
  sendMessage(conversationId: number, body: string): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/${conversationId}/messages`, { body });
  }
}
