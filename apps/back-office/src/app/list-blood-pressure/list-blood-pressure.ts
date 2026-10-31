/* eslint-disable @angular-eslint/no-output-native */
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Observable } from 'rxjs';

@Component({
  selector: 'back-office-list-blood-pressure',
  imports: [CommonModule, TableModule],
  templateUrl: './list-blood-pressure.html',
  styleUrl: './list-blood-pressure.css',
})
export class ListBloodPressure {
  @Input() bloodPressure$: Observable<any>;
  @Input() totalRecords: number;
}
