import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Observable } from 'rxjs';

@Component({
  selector: 'back-office-list-weight',
  imports: [
    CommonModule, 
    TableModule,
  ],
  templateUrl: './list-weight.html',
  styleUrl: './list-weight.css',
})
export class ListWeight {
  @Input() weight$: Observable<any>;
  @Input() totalRecords: number;
}
