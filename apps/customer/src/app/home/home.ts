import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@healbridge/shared';
import { Biometric, ButtonComponent } from '@healbridge/ui';
import { IonImg, IonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  imports: [IonText, IonImg, ButtonComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Home {
  router = inject(Router);
  auth = inject(AuthService);
  showBiometric = false;
  biometricService = inject(Biometric);
  createAccount() {
    this.router.navigateByUrl('signup');
  }

  signIn() {
    this.router.navigateByUrl('login');
  }

  async ionViewWillEnter() {
    this.showBiometric = await this.biometricService.hasBiometricCredentials(
      'customer'
    );
    if (!this.showBiometric) {
      if (this.auth.isUserLoggedIn()) {
        this.router.navigateByUrl('dashboard/home');
      }
    }
  }
}
