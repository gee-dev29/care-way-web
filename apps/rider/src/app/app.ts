import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  imports: [RouterModule],
  selector: 'rider-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'rider';
}
