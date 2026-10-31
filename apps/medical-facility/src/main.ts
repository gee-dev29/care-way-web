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

import {
  environment,
  ErrorInterceptor,
  JwtInterceptor,
} from '@care-way/shared';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { routes } from './app/app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { Capacitor } from '@capacitor/core';
import '@ionic/pwa-elements/dist/ionicpwaelements/ionicpwaelements.js';
import { ApiModule } from '@care-way/api';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { CurrencyPipe } from '@angular/common';
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
    provideFirebaseApp(() => initializeApp(environment.initiateFirebase)),
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
