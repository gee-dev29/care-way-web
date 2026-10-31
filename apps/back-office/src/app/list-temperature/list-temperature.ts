import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Observable } from 'rxjs';

@Component({
  selector: 'back-office-list-temperature',
  imports: [CommonModule, TableModule],
  templateUrl: './list-temperature.html',
  styleUrl: './list-temperature.css',
})
export class ListTemperature {
  @Input() temperature$: Observable<any>;
  @Input() totalRecords: number;
}
