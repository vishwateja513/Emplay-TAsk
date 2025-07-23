import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Card } from '../../models/card.interface';

@Component({
  selector: 'app-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.css']
})
export class EditModalComponent implements OnInit {
  @Input() isOpen = false;
  @Input() card: Card | null = null;
  @Input() isAddMode = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Card>();

  editedCard: Card = { id: 0, title: '', description: '' };
  errors: { [key: string]: string } = {};

  ngOnInit(): void {
    if (this.card) {
      this.editedCard = { ...this.card };
    } else if (this.isAddMode) {
      this.editedCard = { id: 0, title: '', description: '' };
    }
  }

  ngOnChanges(): void {
    if (this.card) {
      this.editedCard = { ...this.card };
    } else if (this.isAddMode) {
      this.editedCard = { id: 0, title: '', description: '' };
    }
    this.errors = {};
  }

  validateForm(): boolean {
    this.errors = {};
    let isValid = true;

    if (!this.editedCard.title.trim()) {
      this.errors['title'] = 'Title is required';
      isValid = false;
    }

    if (!this.editedCard.description.trim()) {
      this.errors['description'] = 'Description is required';
      isValid = false;
    } else if (this.editedCard.description.trim().length < 10) {
      this.errors['description'] = 'Description must be at least 10 characters';
      isValid = false;
    }

    return isValid;
  }

  onSave(): void {
    if (this.validateForm()) {
      this.save.emit({
        ...this.editedCard,
        title: this.editedCard.title.trim(),
        description: this.editedCard.description.trim()
      });
    }
  }

  onCancel(): void {
    this.errors = {};
    this.close.emit();
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }
}