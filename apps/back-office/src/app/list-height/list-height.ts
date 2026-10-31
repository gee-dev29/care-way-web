import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Observable } from 'rxjs';

@Component({
  selector: 'back-office-list-height',
  imports: [
    CommonModule, 
    TableModule,
  ],
  templateUrl: './list-height.html',
  styleUrl: './list-height.css',
})
export class ListHeight {
  @Input() height$: Observable<any>;
  @Input() totalRecords: number;
}
