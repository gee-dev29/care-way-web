import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  environment,
  ErrorInterceptor,
  JwtInterceptor,
} from '@healbridge/shared';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { provideCharts } from 'ng2-charts';
import {
  PreloadAllModules,
  provideRouter,
  RouteReuseStrategy,
  withPreloading,
} from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';
import { ApiModule } from '@healbridge/api';
import { appRoutes } from './app/app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CurrencyPipe } from '@angular/common';

const apiProviders =
  ApiModule.forRoot({ rootUrl: environment.apiUrl }).providers ?? [];
bootstrapApplication(App, {
  providers: [
    ...appConfig.providers,
    CurrencyPipe,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(appRoutes, withPreloading(PreloadAllModules)),
    provideAuth(() => getAuth()),
    provideCharts(),
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
    provideAnimations()
  ],
});
