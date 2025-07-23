import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card } from '../../models/card.interface';

@Component({
  selector: 'app-card-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-item.component.html',
  styleUrls: ['./card-item.component.css']
})
export class CardItemComponent {
  @Input() card!: Card;
  @Output() editCard = new EventEmitter<Card>();
  @Output() deleteCard = new EventEmitter<number>();

  onEdit(): void {
    this.editCard.emit(this.card);
  }

  onDelete(): void {
    if (confirm(`Are you sure you want to delete "${this.card.title}"?`)) {
      this.deleteCard.emit(this.card.id);
    }
  }
}