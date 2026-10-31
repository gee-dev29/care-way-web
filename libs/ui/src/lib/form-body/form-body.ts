import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-form-body',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-body.html',
  styleUrl: './form-body.css',
})
export class FormBody {
  @Input() columns = 'split'
}
