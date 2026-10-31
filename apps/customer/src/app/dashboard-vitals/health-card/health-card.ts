import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IonCard, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-health-card',
  imports: [IonCard, IonIcon],
  templateUrl: './health-card.html',
  styleUrl: './health-card.css',
})
export class HealthCard {
  @Input() icon!: string;
  @Input() title: string;
  @Input() subtitle: string | void;
  @Input() statusColor?: string;
  @Input() statusText?: string;
  @Input() navigate: string;

  router = inject(Router);

  navigateTo() {
    this.router.navigateByUrl(this.navigate);
  }
}
