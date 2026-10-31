import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safe',
})
export class SafePipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);

  transform(value: any, ...args: unknown[]): unknown {
    if (!value) return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(value);
  }
}
