import { inject, Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastController = inject(ToastController);

  async show(message: string, status: 'success' | 'error' = 'success') {
    const iconPath =
      status === 'success'
        ? '/icons/toast-success.svg'
        : '/icons/toast-error.svg';

    const toast = await this.toastController.create({
      message,
      icon: iconPath,
      position: 'top',
      duration: 2000,
      cssClass: [`custom-toast`, `toast-${status}`],
      buttons: [{ role: 'cancel' }],
    });

    await toast.present();
  }
}
