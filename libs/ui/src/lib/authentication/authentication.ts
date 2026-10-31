import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonImg } from '@ionic/angular/standalone';

@Component({
  selector: 'ui-authentication',
  imports: [CommonModule, IonImg],
  templateUrl: './authentication.html',
  styleUrl: './authentication.css',
  standalone: true,
})
export class Authentication {
  @Input() title: string;
  @Input() subtitle: string;
  @Input() leftImage: string;
  @Input() isLongForm = false;
}
