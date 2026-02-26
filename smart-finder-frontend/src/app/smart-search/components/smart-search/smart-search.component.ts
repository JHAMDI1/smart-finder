import { Component, ElementRef, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { LieuCardComponent } from '../../../shared/components/lieu-card/lieu-card.component';

interface SmartSearchResult {
  id: number;
  nom: string;
  description: string;
  adresse: string;
  noteMoyenne: number;
  imageUrl?: string;
}

interface SmartSearchResponse {
  results: SmartSearchResult[];
  extractedCriteria: Record<string, any>;
  interpretedQuery: string;
  totalResults: number;
  searchId: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content?: string;
  isTyping?: boolean;
  searchResponse?: SmartSearchResponse;
}

@Component({
  selector: 'app-smart-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LieuCardComponent],
  templateUrl: './smart-search.component.html',
  styleUrl: './smart-search.component.css'
})
export class SmartSearchComponent implements AfterViewChecked {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  @ViewChild('chatInput') private chatInput!: ElementRef;

  userQuery = '';
  isTyping = false;
  messages: ChatMessage[] = [];

  examples = [
    'Je cherche un espace super calme avec des bureaux fermés, et de la bonne lumière naturelle au centre ville.',
    'Un coworking sympa qui accepte les chiens, avec un espace café et fibre optique !',
    'Une salle de réunion pour 10 personnes avec vidéoprojecteur pour demain matin.'
  ];

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) { }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  autoGrow(el: HTMLTextAreaElement) {
    el.style.height = 'auto';
    el.style.height = (el.scrollHeight < 150 ? el.scrollHeight : 150) + 'px';
  }

  handleEnter(event: Event) {
    const kbEvent = event as KeyboardEvent;
    if (!kbEvent.shiftKey) {
      event.preventDefault();
      this.onSearch();
    }
  }

  onSearch(): void {
    const query = this.userQuery.trim();
    if (!query) return;

    // Add user message
    this.messages.push({
      id: Date.now().toString(),
      role: 'user',
      content: query
    });

    this.userQuery = '';

    // Reset textarea height
    if (this.chatInput) {
      this.chatInput.nativeElement.style.height = 'auto';
    }

    this.scrollToBottom();
    this.requestAI(query);
  }

  private requestAI(query: string) {
    this.isTyping = true;

    // Add placeholder assistant typing message
    const msgId = 'ast-' + Date.now();
    this.messages.push({
      id: msgId,
      role: 'assistant',
      isTyping: true
    });

    const request = {
      userQuery: query,
      latitude: null,
      longitude: null,
      radiusKm: 10.0
    };

    const url = `${environment.apiUrl}/smart-search`;
    console.log('[SmartSearch] 🚀 Sending request to:', url);
    console.log('[SmartSearch] 📦 Request body:', JSON.stringify(request));

    this.http.post<SmartSearchResponse>(url, request)
      .subscribe({
        next: (response) => {
          console.log('[SmartSearch] ✅ Response received:', JSON.stringify(response));
          this.isTyping = false;
          const msgIndex = this.messages.findIndex(m => m.id === msgId);
          if (msgIndex !== -1) {
            // Build text response
            let textResponse = "Voici ce que j'ai trouvé pour vous !";
            if (response.results.length === 0) {
              textResponse = "Mince, aucun lieu ne correspond parfaitement à votre demande actuelle.";
            } else if (response.results.length === 1) {
              textResponse = "J'ai trouvé la perle rare qui semble correspondre à votre demande.";
            }

            this.messages[msgIndex] = {
              ...this.messages[msgIndex],
              isTyping: false,
              content: textResponse,
              searchResponse: response
            };
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('[SmartSearch] ❌ Error:', err);
          console.error('[SmartSearch] ❌ Status:', err.status);
          console.error('[SmartSearch] ❌ Message:', err.message);
          console.error('[SmartSearch] ❌ Body:', JSON.stringify(err.error));
          this.isTyping = false;
          const msgIndex = this.messages.findIndex(m => m.id === msgId);
          if (msgIndex !== -1) {
            this.messages[msgIndex] = {
              ...this.messages[msgIndex],
              isTyping: false,
              content: "❌ Désolé, le concierge virtuel est momentanément indisponible ou n'arrive pas à joindre l'API AI. Veuillez vérifier que votre serveur est bien connecté."
            };
          }
          this.cdr.detectChanges();
        }
      });
  }

  useExample(example: string): void {
    this.userQuery = example;
    this.onSearch();
  }

  formatMessage(text: string): string {
    // Basic text formatting for demo
    return text.replace(/\n/g, '<br/>');
  }

  getCriteriaList(criteria: Record<string, any>): string[] {
    const list: string[] = [];
    for (const [key, value] of Object.entries(criteria)) {
      if (value && value !== 'fallback' && value !== 'error') {
        if (Array.isArray(value) && value.length > 0) {
          list.push(`${key}: ${value.join(', ')}`);
        } else if (!Array.isArray(value) && typeof value === 'string') {
          list.push(`${key}: ${value}`);
        }
      }
    }
    return list;
  }
}

