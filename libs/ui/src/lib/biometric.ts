import { Injectable } from '@angular/core';
import {
  NativeBiometric,
  BiometryType,
} from '@capgo/capacitor-native-biometric';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root',
})
export class Biometric {
  get isNative() {
    return Capacitor.isNativePlatform();
  }

  async isAvailable() {
    if (!this.isNative) {
      return {
        isAvailable: false,
      };
    }
    try {
      return await NativeBiometric.isAvailable();
    } catch {
      return {
        isAvailable: false,
      };
    }
  }

  async isSupported(): Promise<boolean> {
    const available = await this.isAvailable();
    return !!available.isAvailable;
  }

  async authenticate() {
    if (!this.isNative) {
      throw new Error('Biometric authentication is unavailable.');
    }
    try {
      const result = await NativeBiometric.verifyIdentity({
        reason: 'Authenticate to continue',
        title: 'Authentication Required',
        subtitle: 'Login',
        description: 'Use your phone biometric',
        maxAttempts: 3,
      });
      return result;
    } catch (error) {
      throw new Error('Biometric authentication failed or cancelled.');
    }
  }

  async enableBiometric(username: string, token: string, module: string) {
    if (!this.isNative) {
      throw new Error('Biometric authentication is unavailable.');
    }
    await NativeBiometric.setCredentials({
      username,
      password: token,
      server: module,
    });
  }

  async getCredentials(module: string) {
    return await NativeBiometric.getCredentials({
      server: module,
    });
  }

  async disableBiometric(module: string) {
    if (!this.isNative) {
      return;
    }
    await NativeBiometric.deleteCredentials({
      server: module,
    });
  }

  async loginWithBiometric(module: string) {
    const available = await this.isAvailable();

    if (!available.isAvailable) {
      throw new Error('Biometric authentication is unavailable.');
    }

    await this.authenticate();

    return await this.getCredentials(module);
  }

  async hasBiometricCredentials(module: string): Promise<boolean> {
    try {
      const available = await this.isAvailable();

      if (!available.isAvailable) {
        return false;
      }

      const credentials = await NativeBiometric.getCredentials({
        server: module,
      });

      return !!credentials?.username && !!credentials?.password;
    } catch {
      return false;
    }
  }
}
