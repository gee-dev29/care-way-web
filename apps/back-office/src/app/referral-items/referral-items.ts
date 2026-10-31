import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { ReferralType } from '@healbridge/api';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'back-office-referral-items',
  imports: [TableModule, CommonModule],
  templateUrl: './referral-items.html',
  styleUrl: './referral-items.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ReferralItems {
  @Input() heading: string;
  @Input() isReferral: ReferralType;
  @Input() referralItems: object[];
  @Input() totalRecords: number;
  @Input() referralType: ReferralType;
  type = ReferralType;
}
