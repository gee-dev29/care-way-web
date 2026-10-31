import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Observable } from 'rxjs';

@Component({
  selector: 'back-office-list-oxygen-saturation',
  imports: [
    CommonModule, 
    TableModule,
  ],
  templateUrl: './list-oxygen-saturation.html',
  styleUrl: './list-oxygen-saturation.css',
})
export class ListOxygenSaturation {
  @Input() oxygenSaturation$: Observable<any>;
  @Input() totalRecords: number;
}
