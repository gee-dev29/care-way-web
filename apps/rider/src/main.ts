import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { CurrencyPipe } from '@angular/common';

bootstrapApplication(App, {
  providers: [appConfig.providers, CurrencyPipe],
}).catch((err) => console.error(err));
