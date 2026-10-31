import { CapacitorConfig } from '@capacitor/cli';
/* eslint-disable @nx/enforce-module-boundaries */

const config: CapacitorConfig = {
  appId: 'app.healbridge.customer',
  appName: 'Care-Way Customer',
  webDir: '../../dist/apps/customer/browser',
  bundledWebRuntime: false,
  server: {
    iosScheme: 'https',
    androidScheme: 'https',
    hostname: 'customer.healbridge.app',
    cleartext: true,
  },
  plugins: {
    Keyboard: {
      resize: 'none',
    },
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 0,
      backgroundColor: '#ffffff',
      androidSplashResourceName: 'splash',
      showSpinner: false,
    },
  },
};

export default config;
