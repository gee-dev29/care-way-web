import { Component, Input } from '@angular/core';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'ui-page-body',
  imports: [Navbar],
  templateUrl: './page-body.html',
  styleUrl: './page-body.css',
})
export class PageBody {
  @Input() background: string;
}
