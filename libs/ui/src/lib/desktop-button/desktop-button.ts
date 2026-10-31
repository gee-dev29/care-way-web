import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ui-desktop-button',
  imports: [],
  templateUrl: './desktop-button.html',
  styleUrl: './desktop-button.css',
})
export class DesktopButton {
  @Input() primary = false;
  @Input() secondary = false;
  @Input() tertiary = true;
  @Input() backgroundColor?: 'string';
  @Input() size: 'small' | 'medium' | 'large' | 'full' = 'medium';
  @Input() width: 'fit' | 'full' = 'fit';
  @Input() label: string;
  @Input() loading = false;
  @Input() disabled = false;
  @Output() Click = new EventEmitter<Event>();
  public get classes(): string[] {
    const mode = this.primary
      ? 'storybook-button--primary'
      : 'storybook-button--secondary';

    return [
      'storybook-button',
      `storybook-button--${this.size}`,
      mode,
      this.width,
    ];
  }
}
