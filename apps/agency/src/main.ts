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

import { appRoutes } from './app/app.routes';
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
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { Capacitor } from '@capacitor/core';
// import '@ionic/pwa-elements/dist/ionicpwaelements/ionicpwaelements.js';
import { ApiModule } from '@healbridge/api';
import { CurrencyPipe } from '@angular/common';
// import { provideCharts } from 'ng2-charts';
// import { Chart, registerables } from 'chart.js';

// Chart.register(...registerables);
const apiProviders =
  ApiModule.forRoot({ rootUrl: environment.apiUrl }).providers ?? [];
bootstrapApplication(AppComponent, {
  providers: [
    CurrencyPipe,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(appRoutes, withPreloading(PreloadAllModules)),
    provideAnimations(),
    provideFirebaseApp(() => initializeApp(environment.initiateFirebase)),
    provideAuth(() => getAuth()),
    // provideCharts(),
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
