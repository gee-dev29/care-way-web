import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DesktopButton, InputDropDownComponent } from '@care-way/ui';
import moment from 'moment';
import { DatePickerModule } from 'primeng/datepicker';
import { TableModule } from 'primeng/table';
import { Observable } from 'rxjs';

@Component({
  selector: 'back-office-withdrawal-table',
  imports: [TableModule, CommonModule, DesktopButton, FormsModule, InputDropDownComponent, DatePickerModule],
  templateUrl: './withdrawal-table.html',
  styleUrl: './withdrawal-table.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class WithdrawalTable {
  @Input() totalRecords: number;
  @Input() withdrawals$: Observable<any>;
  @Input() withdrawalStatuses: any;
  @Output() onLoad = new EventEmitter<Event>();
  @Output() viewDetails = new EventEmitter<Event>();
  @Output() withdrawalStatus = new EventEmitter<String>();
  @Output() dateFilter = new EventEmitter<String>();
  moment = moment;

  load(event: any) {
    this.onLoad.emit(event);
  }

  view(item: any) {
    this.viewDetails.emit(item);
  }

  filterByWithdrawalStatus(item: any) {
    this.withdrawalStatus.emit(item);
  }
  
  filterByDate(item: any){
    this.dateFilter.emit(item)
  }
}
