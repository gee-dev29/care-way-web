import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppVersion {
  compareVersions(current: string, minimum: string): boolean {
    const currentParts = current.split('.').map(Number);
    const minimumParts = minimum.split('.').map(Number);

    const length = Math.max(currentParts.length, minimumParts.length);

    for (let i = 0; i < length; i++) {
      const currentValue = currentParts[i] || 0;
      const minimumValue = minimumParts[i] || 0;

      if (currentValue > minimumValue) return true;
      if (currentValue < minimumValue) return false;
    }

    return true;
  }
}
