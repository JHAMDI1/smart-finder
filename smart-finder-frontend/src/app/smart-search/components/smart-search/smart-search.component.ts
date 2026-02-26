import { Component, ElementRef, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment';

interface SmartSearchResult {
  id: number;
  nom: string;
  description: string;
  adresse: string;
  noteMoyenne: number;
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
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="h-[calc(100vh-64px)] md:h-[calc(100vh-72px)] flex flex-col bg-gray-50 overflow-hidden relative">
      
      <!-- Top Decor -->
      <div class="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-indigo-900 via-primary-900 to-indigo-800 opacity-100 z-0">
        <svg class="absolute inset-0 w-full h-full text-white/5 mix-blend-overlay" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="grid-search" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M 8 0 L 0 0 0 8" fill="none" stroke="currentColor" stroke-width="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid-search)" />
        </svg>
      </div>
      <div class="absolute top-96 left-0 w-full h-32 bg-gradient-to-b from-indigo-800 to-gray-50 z-0"></div>

      <!-- Header -->
      <div class="relative z-10 pt-8 pb-4 text-center">
        <div class="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg">
          <div class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <span class="text-xs font-semibold tracking-widest uppercase">Concierge IA en ligne</span>
        </div>
        <h1 class="text-3xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
          Trouvez votre Espace<br>avec <span class="text-amber-400">SmartSearch</span>
        </h1>
      </div>

      <!-- Chat Container -->
      <div class="flex-1 w-full max-w-4xl mx-auto px-4 lg:px-0 relative z-10 flex flex-col min-h-0 mb-4">
        
        <!-- Main Chat Area Container (Scrollable) -->
        <div 
          class="flex-1 bg-white/80 backdrop-blur-xl md:rounded-t-3xl border-x border-t border-white/40 shadow-2xl flex flex-col overflow-hidden relative"
          style="box-shadow: 0 -10px 40px -15px rgba(0,0,0,0.1);"
        >
          
          <!-- Inner Chat Scroll -->
          <div #chatContainer class="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth">
            
            <!-- Welcome Message (Always visible first) -->
            <div class="flex items-start gap-4 animate-fade-in-up">
              <div class="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-primary-600 to-indigo-600 flex items-center justify-center text-white shadow-lg ring-2 ring-white">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <div class="bg-white rounded-2xl rounded-tl-sm p-4 md:p-5 shadow-sm border border-gray-100 max-w-[85%] text-gray-800 textFrame">
                <p class="mb-3">Bonjour ! Je suis l'IA de SmartFinder. Décrivez-moi l'espace de travail idéal que vous recherchez.</p>
                <div class="space-y-2 mt-4" *ngIf="messages.length === 0">
                  <p class="text-xs text-gray-400 uppercase font-semibold tracking-wider">Essayez de demander :</p>
                  <div class="flex flex-col gap-2">
                    <button 
                      *ngFor="let ex of examples" 
                      (click)="useExample(ex)"
                      class="text-left text-sm p-3 rounded-xl bg-primary-50 hover:bg-primary-100 text-primary-700 transition-colors border border-primary-100 font-medium"
                    >
                      "{{ ex }}"
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Chat History -->
            <ng-container *ngFor="let msg of messages; let i = index">
              
              <!-- User Message -->
              <div *ngIf="msg.role === 'user'" class="flex items-end justify-end gap-3 animate-fade-in-up">
                <div class="bg-gray-900 text-white rounded-2xl rounded-tr-sm p-4 md:p-5 shadow-md max-w-[85%]">
                  <p class="whitespace-pre-wrap">{{ msg.content }}</p>
                </div>
              </div>

              <!-- Assistant Message Wrapper -->
              <div *ngIf="msg.role === 'assistant'" class="flex items-start gap-4 animate-fade-in-up mt-6">
                
                <!-- Avatar -->
                <div class="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-primary-600 to-indigo-600 flex items-center justify-center text-white shadow-lg ring-2 ring-white">
                  <div *ngIf="msg.isTyping" class="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                  <svg *ngIf="!msg.isTyping" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                
                <!-- Content Box -->
                <div class="flex-1 max-w-[85%]">
                  
                  <!-- Typing Indicator -->
                  <div *ngIf="msg.isTyping" class="bg-white rounded-2xl rounded-tl-sm p-4 mb-2 shadow-sm border border-gray-100 inline-block">
                    <div class="flex gap-1.5 items-center justify-center h-4">
                      <div class="w-2 h-2 rounded-full bg-primary-400 animate-bounce"></div>
                      <div class="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style="animation-delay: 0.15s"></div>
                      <div class="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style="animation-delay: 0.3s"></div>
                    </div>
                  </div>

                  <!-- Text Response -->
                  <div *ngIf="msg.content && !msg.isTyping" class="bg-white rounded-2xl rounded-tl-sm p-4 md:p-5 shadow-sm border border-gray-100 text-gray-800 mb-3">
                    <p [innerHTML]="formatMessage(msg.content)"></p>
                    
                    <!-- Extracted Tags -->
                    <div *ngIf="msg.searchResponse?.extractedCriteria && getCriteriaList(msg.searchResponse!.extractedCriteria).length > 0" class="mt-4 pt-4 border-t border-gray-100">
                      <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">J'ai pris en compte :</p>
                      <div class="flex flex-wrap gap-1.5">
                         <span 
                          *ngFor="let criteria of getCriteriaList(msg.searchResponse!.extractedCriteria)"
                          class="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md text-xs font-medium border border-indigo-100"
                        >
                          {{ criteria }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Search Results Highlights -->
                  <div *ngIf="msg.searchResponse && !msg.isTyping" class="space-y-3 mt-4">
                    <p class="text-sm font-bold text-gray-700 flex items-center gap-2">
                       <span class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs">
                         ✓
                       </span>
                       {{ msg.searchResponse.totalResults }} espace(s) trouvé(s) !
                    </p>
                    
                    <!-- Horizontal Scroll Row for Results -->
                    <div class="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 md:mx-0 md:px-0 snap-x">
                      
                      <!-- Empty State -->
                      <div *ngIf="msg.searchResponse.results.length === 0" class="w-full bg-gray-50 rounded-2xl p-6 text-center border border-dashed border-gray-200">
                         <p class="text-gray-500 font-medium pb-2">Je n'ai rien trouvé de parfait avec ces critères exacts.</p>
                         <button (click)="chatInput.focus()" class="text-primary-600 font-bold text-sm hover:underline">Essayer de formuler autrement</button>
                      </div>

                      <!-- Result Cards -->
                      <div 
                        *ngFor="let lieu of msg.searchResponse.results"
                        [routerLink]="['/lieux', lieu.id]"
                        class="min-w-[280px] w-[280px] bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-primary-200 transition-all cursor-pointer snap-start flex flex-col overflow-hidden group"
                      >
                        <div class="h-32 bg-gray-200 relative overflow-hidden">
                          <!-- Image placeholder gradient until real images are added to DB -->
                          <div class="absolute inset-0 bg-gradient-to-br from-indigo-100 to-emerald-50"></div>
                          <div class="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                          <div class="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                            <span *ngIf="lieu.noteMoyenne" class="bg-white/90 backdrop-blur text-sm font-black px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-sm text-gray-800">
                              ⭐ {{ lieu.noteMoyenne | number:'1.1-1' }}
                            </span>
                          </div>
                        </div>
                        <div class="p-4 flex flex-col flex-1">
                          <h4 class="font-bold text-gray-900 truncate mb-1">{{ lieu.nom }}</h4>
                          <p class="text-xs text-gray-500 truncate flex items-center gap-1 mb-2">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                            {{ lieu.adresse }}
                          </p>
                          <p class="text-sm text-gray-600 line-clamp-2 mt-auto">{{ lieu.description }}</p>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </ng-container>

          </div>

          <!-- Input Area (Fixed to bottom of card) -->
          <div class="bg-white border-t border-gray-100 p-4 md:p-6 pb-6 md:pb-6 rounded-b-3xl shrink-0">
            <div class="relative bg-gray-50 rounded-2xl border border-gray-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 transition-all shadow-inner">
              <textarea
                #chatInput
                [(ngModel)]="userQuery"
                (keydown.enter)="handleEnter($event)"
                [disabled]="isTyping"
                placeholder="Racontez-moi ce qu'il vous faut..."
                class="w-full bg-transparent p-4 pr-16 resize-none focus:outline-none text-gray-800 placeholder-gray-400 min-h-[60px] max-h-[150px] overflow-y-auto disabled:opacity-50"
                rows="1"
                (input)="autoGrow(chatInput)"
              ></textarea>
              <button
                (click)="onSearch()"
                [disabled]="isTyping || !userQuery.trim()"
                class="absolute right-2 bottom-2 p-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 text-white disabled:opacity-40 disabled:from-gray-400 disabled:to-gray-400 hover:shadow-lg hover:-translate-y-0.5 transition-all outline-none"
              >
                <svg class="w-5 h-5 translate-x-px -translate-y-px" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                </svg>
              </button>
            </div>
            <p class="text-center text-[10px] text-gray-400 mt-3 flex items-center justify-center gap-1 uppercase tracking-wider">
              <svg class="w-3 h-3 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/></svg>
              Propulsé par DeepSeek AI
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in-up {
      animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(15px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    /* Scrollbar styling for horizontal results */
    .snap-x::-webkit-scrollbar {
      height: 6px;
    }
    .snap-x::-webkit-scrollbar-track {
      background: transparent;
    }
    .snap-x::-webkit-scrollbar-thumb {
      background-color: #e5e7eb;
      border-radius: 20px;
    }
    .snap-x::-webkit-scrollbar-thumb:hover {
      background-color: #d1d5db;
    }
  `]
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

