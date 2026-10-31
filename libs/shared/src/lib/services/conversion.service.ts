import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConversionService {
  convert(input: any, options: any) {
    for (const [propertyKey, propertyValue] of Object.entries(input)) {
      options.push({ value: propertyKey, text: propertyValue });
    }
  }
}
