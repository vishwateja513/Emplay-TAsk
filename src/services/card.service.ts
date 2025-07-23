import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Card } from '../models/card.interface';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private readonly STORAGE_KEY = 'cards-data';
  private cardsSubject = new BehaviorSubject<Card[]>([]);
  public cards$ = this.cardsSubject.asObservable();

  constructor() {
    this.loadCardsFromStorage();
  }

  private loadCardsFromStorage(): void {
    const storedCards = localStorage.getItem(this.STORAGE_KEY);
    if (storedCards) {
      try {
        const cards = JSON.parse(storedCards);
        this.cardsSubject.next(cards);
      } catch (error) {
        console.error('Error parsing stored cards:', error);
        this.initializeDefaultCards();
      }
    } else {
      this.initializeDefaultCards();
    }
  }

  private initializeDefaultCards(): void {
    const defaultCards: Card[] = [
      {
        id: 1,
        title: 'Card 1',
        description: 'This is the description for card 1.'
      },
      {
        id: 2,
        title: 'Card 2',
        description: 'This is the description for card 2.'
      },
      {
        id: 3,
        title: 'Card 3',
        description: 'This is the description for card 3.'
      }
    ];
    this.cardsSubject.next(defaultCards);
    this.saveCardsToStorage(defaultCards);
  }

  private saveCardsToStorage(cards: Card[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cards));
    } catch (error) {
      console.error('Error saving cards to storage:', error);
    }
  }

  getCards(): Observable<Card[]> {
    return this.cards$;
  }

  updateCard(updatedCard: Card): void {
    const currentCards = this.cardsSubject.value;
    const updatedCards = currentCards.map(card => 
      card.id === updatedCard.id ? updatedCard : card
    );
    this.cardsSubject.next(updatedCards);
    this.saveCardsToStorage(updatedCards);
  }

  addCard(newCard: Omit<Card, 'id'>): void {
    const currentCards = this.cardsSubject.value;
    const maxId = currentCards.length > 0 ? Math.max(...currentCards.map(c => c.id)) : 0;
    const cardWithId: Card = {
      ...newCard,
      id: maxId + 1
    };
    const updatedCards = [...currentCards, cardWithId];
    this.cardsSubject.next(updatedCards);
    this.saveCardsToStorage(updatedCards);
  }

  deleteCard(cardId: number): void {
    const currentCards = this.cardsSubject.value;
    const updatedCards = currentCards.filter(card => card.id !== cardId);
    this.cardsSubject.next(updatedCards);
    this.saveCardsToStorage(updatedCards);
  }

  getCardById(id: number): Card | undefined {
    return this.cardsSubject.value.find(card => card.id === id);
  }
}