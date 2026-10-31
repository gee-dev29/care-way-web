import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SplitButtonModule } from 'primeng/splitbutton';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'ui-split-button',
  imports: [
    CommonModule,
    SplitButtonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './split-button.html',
  styleUrl: './split-button.css',
})
export class SplitButtonComponent {
  @Input() items: MenuItem[];
  @Input() label: string;
  @Input() disabled: boolean;
  @Output() Click = new EventEmitter();
  @Output() Change = new EventEmitter();
}
