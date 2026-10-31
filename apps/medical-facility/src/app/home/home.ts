import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@healbridge/shared';
import { ButtonComponent } from '@healbridge/ui';
import { IonImg, IonRouterOutlet, IonText } from '@ionic/angular/standalone';

@Component({
  selector: 'medical-facility-home',
  imports: [IonText, IonImg, ButtonComponent, IonRouterOutlet],
  templateUrl: './home.html',
  styleUrl: './home.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Home {
  router = inject(Router);
  auth = inject(AuthService);
  routeTo(route: string) {
    this.router.navigateByUrl(route);
  }

  ionViewWillEnter() {
    if (this.auth.isUserLoggedIn()) {
      this.router.navigateByUrl('dashboard/home');
    }
  }
}
