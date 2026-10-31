import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AgoraService } from '@care-way/shared';
import { IonIcon } from '@ionic/angular/standalone';
import { filter } from 'rxjs';

@Component({
  selector: 'app-active-call-indicator',
  imports: [IonIcon],
  templateUrl: './active-call-indicator.html',
  styleUrl: './active-call-indicator.css',
})
export class ActiveCallIndicatorComponent {
  callService = inject(AgoraService);
  router = inject(Router);
  currentUrl = signal('');

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentUrl.set(event.urlAfterRedirects);
      });
  }

  get showIndicator() {
    return (
      this.callService.isCallOn() &&
      !this.currentUrl().includes('appointment-video-call')
    );
  }

  returnToCall() {
    this.router.navigate([
      '/dashboard/appointment-video-call',
      this.callService.appointmentId,
    ]);
  }
}
