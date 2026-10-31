import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'amountFormat',
  standalone: true,
})
export class AmountFormatPipe implements PipeTransform {
  transform(value: unknown): string {
    const num = Number(String(value ?? 0).replace(/,/g, ''));
    if (isNaN(num)) return '0.00';
    return num.toLocaleString('en-NG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
}