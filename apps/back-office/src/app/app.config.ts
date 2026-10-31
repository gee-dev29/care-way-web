import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
      ripple: true,
    }),
    provideToastr({
      positionClass: 'toast-top-right',
      timeOut: 5000,
      preventDuplicates: true,
      progressBar: true,
      // closeButton: true,
      newestOnTop: true,
      tapToDismiss: true,
      maxOpened: 3,
      autoDismiss: true,
    }),
  ],
};
