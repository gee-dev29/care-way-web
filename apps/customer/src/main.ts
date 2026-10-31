import { bootstrapApplication } from '@angular/platform-browser';
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import {
  environment,
  ErrorInterceptor,
  JwtInterceptor,
} from '@healbridge/shared';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { Capacitor } from '@capacitor/core';
import { ApiModule } from '@healbridge/api';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { CurrencyPipe } from '@angular/common';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
AgoraRTC.setLogLevel(3);

const apiProviders =
  ApiModule.forRoot({ rootUrl: environment.apiUrl }).providers ?? [];
bootstrapApplication(AppComponent, {
  providers: [
    CurrencyPipe,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideAnimations(),
    // Theme for PrimeNG-based @healbridge/ui inputs; dark mode follows a
    // class the app never sets, so dropdowns stay light like the rest of the UI.
    providePrimeNG({
      theme: { preset: Aura, options: { darkModeSelector: '.p-dark' } },
    }),
    provideAuth(() => getAuth()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    provideHttpClient(withInterceptorsFromDi()),
    ...apiProviders,
  ],
});
if (Capacitor.getPlatform() === 'web') {
  defineCustomElements(window);
}
