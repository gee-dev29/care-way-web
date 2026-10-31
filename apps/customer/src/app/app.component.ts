import { Component, inject, OnInit } from '@angular/core';
import {
  IonApp,
  IonRouterOutlet,
  IonIcon,
  IonImg,
} from '@ionic/angular/standalone';
import { Keyboard, KeyboardResize } from '@capacitor/keyboard';
import { Router } from '@angular/router';
import { ActiveCallIndicatorComponent } from './active-call-indicator/active-call-indicator';
import { ApiService, AppName } from '@healbridge/api';
import { Capacitor } from '@capacitor/core';
import { AppVersion, ButtonComponent } from '@healbridge/ui';
import { App } from '@capacitor/app';
import { addIcons } from 'ionicons';
import { cloudDownloadOutline } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [
    IonApp,
    IonRouterOutlet,
    ActiveCallIndicatorComponent,
    IonIcon,
    ButtonComponent,
    IonImg,
  ],
})
export class AppComponent implements OnInit {
  private router = inject(Router);
  showSplash = false;
  api = inject(ApiService);
  appVersion = inject(AppVersion);
  showForceUpdate = false;
  storeUrl: string;
  currentVersion: any = 1;
  requiredVersion: any = 1.1;

  constructor() {
    if (Capacitor.isNativePlatform()) {
      Keyboard.setResizeMode({ mode: KeyboardResize.None });
      Keyboard.setAccessoryBarVisible({ isVisible: false });
    }
    document.documentElement.classList.remove('ion-color-scheme-dark');
    document.documentElement.classList.add('ion-color-scheme-light');
    document.documentElement.style.setProperty('color-scheme', 'light');
  }

  async ngOnInit() {
    addIcons({ cloudDownloadOutline });
    if (!Capacitor.isNativePlatform()) {
      this.showSplash = false;
      return;
    }
    this.showSplash = true;
    setTimeout(async () => {
      this.showSplash = false;
      const info = await App.getInfo();
      this.currentVersion = info.version;
      this.api
        .getMinimumAppVersion({ appName: AppName.Customer as any })
        .subscribe((response: any) => {
          const minimum =
            Capacitor.getPlatform() === 'android'
              ? response.androidVersionNumber
              : response.iosVersionNumber;
          this.requiredVersion = minimum;

          if (!this.appVersion.compareVersions(info.version, minimum)) {
            this.showForceUpdate = true;
            this.storeUrl =
              Capacitor.getPlatform() === 'android'
                ? 'https://play.google.com/store/apps/details?id=app.healbridge.customer'
                : 'https://apps.apple.com/app/idXXXXXXXX';
          }
        });
    }, 3000);
  }
  async updateApp() {
    window.open(this.storeUrl, '_system');
  }
}
