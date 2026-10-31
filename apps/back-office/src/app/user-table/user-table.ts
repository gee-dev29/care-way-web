import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { DesktopButton } from '@care-way/ui';
import { TableModule } from 'primeng/table';
import { Observable } from 'rxjs';

@Component({
  selector: 'back-office-user-table',
  imports: [DesktopButton, TableModule, CommonModule],
  templateUrl: './user-table.html',
  styleUrl: './user-table.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UserTable {
  @Input() user$: Observable<any>;
  @Input() totalRecords: number;
  @Output() viewDetails = new EventEmitter<Event>();
  @Output() onLoad = new EventEmitter<Event>();

  load(event: any) {
    this.onLoad.emit(event);
  }
  view(item: any) {
    this.viewDetails.emit(item);
  }
}
