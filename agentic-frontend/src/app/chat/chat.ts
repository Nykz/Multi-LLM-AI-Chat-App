import { ChatService } from './../services/chat/chat';
import { Component, inject, OnDestroy, signal, effect, viewChild, ElementRef } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MultiLlmChatService } from '../services/multi-llm-chat/multi-llm-chat';

// Define a type for your message history for better type safety
type Message = {
  id: number;
  text: string;
  from: 'user' | 'bot';
  modelName?: string;
};

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
})
export class Chat implements OnDestroy {
  // --- State Signals ---
  history = signal<Message[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  message = signal<string>('');

  chatContainer = viewChild<ElementRef<HTMLDivElement>>('chatContainer');

  private chatSub?: Subscription;

  private chatService = inject(ChatService);
  private multiLlmChatService = inject(MultiLlmChatService);

  constructor() {
    effect(() => {
      if (this.history().length > 0) this.scrollToBottom();
    });
  }

  sendMessage(): void {
    if (this.loading() || !this.message().trim()) {
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      text: this.message(),
      from: 'user',
    };

    // Update history with the new user message
    this.history.update((currentHistory) => [...currentHistory, userMessage]);
    this.message.set(''); // Clear the input

    // this.askGemini(userMessage);
    this.askLlms(userMessage);
  }

  askGemini(userMessage: Message): void {
    // Set loading state
    this.loading.set(true);
    this.error.set(null);

    this.chatSub = this.chatService.sendMessage(userMessage.text).subscribe({
      next: (response) => {
        const botMessage: Message = {
          id: Date.now() + 1,
          text: response,
          from: 'bot',
        };
        this.history.update((currentHistory) => [...currentHistory, botMessage]);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });

    // // --- Simulate a bot response ---
    // setTimeout(() => {
    //   const botMessage: Message = {
    //     id: Date.now() + 1,
    //     text: 'This is a simulated response from the bot.',
    //     from: 'bot',
    //   };
    //   this.history.update((currentHistory) => [...currentHistory, botMessage]);
    //   this.loading.set(false);
    // }, 2000);
  }

  async askLlms(userMessage: Message) {
    try {
      // Set loading state
      this.loading.set(true);
      this.error.set(null);

      const results = await this.multiLlmChatService.askAll(userMessage.text);
      console.log('LLM results:', results);

      results.forEach((result) => {
        const botMessage: Message = {
          id: Date.now() + Math.random(), // Ensure unique ID
          text: result.reply,
          from: 'bot',
          modelName: result.model,
        };
        this.history.update((currentHistory) => [...currentHistory, botMessage]);
      });
    } catch (error) {
      this.error.set(error as string);
    } finally {
      this.loading.set(false);
    }
  }

  private scrollToBottom(): void {
    const container = this.chatContainer();
    if (container) {
      // We use a small timeout to ensure that the DOM has been updated
      // with the new message before we try to scroll.
      setTimeout(
        () => (container.nativeElement.scrollTop = container.nativeElement.scrollHeight),
        0
      );
    }
  }

  ngOnDestroy(): void {
    this.chatSub?.unsubscribe();
  }
}
