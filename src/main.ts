import { Component, OnInit } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { Card } from './models/card.interface';
import { CardService } from './services/card.service';
import { CardItemComponent } from './components/card-item/card-item.component';
import { EditModalComponent } from './components/edit-modal/edit-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, CardItemComponent, EditModalComponent],
  template: `
    <div class="app-container">
      <header class="app-header">
        <h1 class="app-title">Card Manager</h1>
        <p class="app-subtitle">Manage your cards with dynamic content</p>
        <button 
          class="add-btn" 
          (click)="onAddCard()"
          type="button">
          + Add New Card
        </button>
      </header>

      <main class="main-content">
        <div class="cards-grid" *ngIf="(cards$ | async)?.length; else noCards">
          <app-card-item
            *ngFor="let card of cards$ | async; trackBy: trackByCardId"
            [card]="card"
            (editCard)="onEditCard($event)"
            (deleteCard)="onDeleteCard($event)">
          </app-card-item>
        </div>

        <ng-template #noCards>
          <div class="empty-state">
            <div class="empty-icon">📝</div>
            <h3 class="empty-title">No cards yet</h3>
            <p class="empty-description">Create your first card to get started</p>
            <button 
              class="btn btn-primary" 
              (click)="onAddCard()"
              type="button">
              Add Your First Card
            </button>
          </div>
        </ng-template>
      </main>

      <app-edit-modal
        [isOpen]="isModalOpen"
        [card]="selectedCard"
        [isAddMode]="isAddMode"
        (close)="onModalClose()"
        (save)="onModalSave($event)">
      </app-edit-modal>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      padding: 0;
    }

    .app-header {
      background: white;
      padding: 32px 24px;
      text-align: center;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      margin-bottom: 32px;
    }

    .app-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 8px 0;
      background: linear-gradient(135deg, #2563eb, #7c3aed);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .app-subtitle {
      font-size: 1.125rem;
      color: #6b7280;
      margin: 0 0 24px 0;
    }

    .add-btn {
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 1rem;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    }

    .add-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
    }

    .main-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px 32px;
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 24px;
      animation: fadeIn 0.6s ease-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .empty-state {
      text-align: center;
      padding: 64px 24px;
      animation: fadeIn 0.6s ease-out;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 16px;
    }

    .empty-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 8px 0;
    }

    .empty-description {
      font-size: 1rem;
      color: #6b7280;
      margin: 0 0 24px 0;
    }

    .btn {
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
      font-size: 1rem;
    }

    .btn-primary {
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      color: white;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
    }

    @media (max-width: 768px) {
      .app-header {
        padding: 24px 16px;
      }
      
      .app-title {
        font-size: 2rem;
      }
      
      .main-content {
        padding: 0 16px 24px;
      }
      
      .cards-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }
      
      .empty-state {
        padding: 48px 16px;
      }
    }

    @media (max-width: 480px) {
      .app-title {
        font-size: 1.75rem;
      }
      
      .app-subtitle {
        font-size: 1rem;
      }
    }
  `]
})
export class App implements OnInit {
  cards$: Observable<Card[]>;
  isModalOpen = false;
  selectedCard: Card | null = null;
  isAddMode = false;

  constructor(private cardService: CardService) {
    this.cards$ = this.cardService.getCards();
  }

  ngOnInit(): void {
    // Cards are automatically loaded by the service
  }

  trackByCardId(index: number, card: Card): number {
    return card.id;
  }

  onEditCard(card: Card): void {
    this.selectedCard = card;
    this.isAddMode = false;
    this.isModalOpen = true;
  }

  onAddCard(): void {
    this.selectedCard = null;
    this.isAddMode = true;
    this.isModalOpen = true;
  }

  onDeleteCard(cardId: number): void {
    this.cardService.deleteCard(cardId);
  }

  onModalClose(): void {
    this.isModalOpen = false;
    this.selectedCard = null;
    this.isAddMode = false;
  }

  onModalSave(card: Card): void {
    if (this.isAddMode) {
      this.cardService.addCard({
        title: card.title,
        description: card.description
      });
    } else {
      this.cardService.updateCard(card);
    }
    this.onModalClose();
  }
}

bootstrapApplication(App);