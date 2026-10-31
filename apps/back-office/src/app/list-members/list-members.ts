/* eslint-disable @angular-eslint/no-output-native */
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DesktopButton } from '@care-way/ui';
import { TableModule } from 'primeng/table';
import { Observable } from 'rxjs';

@Component({
  selector: 'back-office-list-members',
  imports: [CommonModule, TableModule, DesktopButton],
  templateUrl: './list-members.html',
  styleUrl: './list-members.css',
})
export class ListMembers {
  @Input() members$: Observable<any>;
  @Input() totalRecords: number;
  @Output() load = new EventEmitter();
}
