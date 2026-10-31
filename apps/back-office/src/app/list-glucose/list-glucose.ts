import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Observable } from 'rxjs';
import { DesktopButton, Modal } from '@care-way/ui';

@Component({
  selector: 'back-office-list-glucose',
  imports: [
    CommonModule, 
    TableModule, 
    DesktopButton,
    Modal,
  ],
  templateUrl: './list-glucose.html',
  styleUrl: './list-glucose.css',
})
export class ListGlucose implements OnInit{
  @Input() glucose$: Observable<any>;
  @Input() totalRecords: number;
  glucoseModal: boolean;
  vitalRecordId: any;

  ngOnInit(): void {
      
  }
  openGlucoseModal(item: any) {
    this.vitalRecordId = item;
    this.glucoseModal = !this.glucoseModal;
  }
}
