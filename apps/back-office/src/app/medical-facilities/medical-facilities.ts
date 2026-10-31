import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { ApiService } from '@healbridge/api';
import { DesktopButton } from '@healbridge/ui';
import { TableModule } from 'primeng/table';
import { map, Observable, tap } from 'rxjs';

@Component({
  selector: 'back-office-medical-facilities',
  imports: [CommonModule, TableModule, DesktopButton],
  templateUrl: './medical-facilities.html',
  styleUrl: './medical-facilities.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MedicalFacilities {
  api = inject(ApiService);
  @Input() totalRecords: number;
  @Input() medicalFacilities$: Observable<any>;
  @Output() onLoad = new EventEmitter<Event>();
  @Output() viewDetails = new EventEmitter<Event>();

  load(event: any) {
    this.onLoad.emit(event);
  }

  view(item: any) {
    this.viewDetails.emit(item);
  }
}
