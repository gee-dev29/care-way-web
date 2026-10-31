import { Component } from '@angular/core';

import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  imports: [IonApp, IonRouterOutlet],
  selector: 'agency-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'agency';
}
