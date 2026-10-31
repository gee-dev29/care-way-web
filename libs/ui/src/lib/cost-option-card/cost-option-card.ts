import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { IonIcon, IonSkeletonText } from '@ionic/angular/standalone';

@Component({
  selector: 'ui-cost-option-card',
  imports: [CommonModule, IonIcon, IonSkeletonText],
  templateUrl: './cost-option-card.html',
  styleUrl: './cost-option-card.css',
})
export class CostOptionCard {
  @Input() option: any;
  @Output() navigateTo = new EventEmitter();
  private router = inject(Router);
}
