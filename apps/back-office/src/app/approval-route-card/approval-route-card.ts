import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'back-office-approval-route-card',
  imports: [CommonModule],
  templateUrl: './approval-route-card.html',
  styleUrl: './approval-route-card.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ApprovalRouteCard {
  @Input() approvalRouteDetails: any;
  @Output() editAction = new EventEmitter<any>();
}
