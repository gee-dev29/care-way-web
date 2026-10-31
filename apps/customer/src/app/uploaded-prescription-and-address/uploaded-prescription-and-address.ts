import { Component, inject, OnInit } from '@angular/core';
import { UploadedPrescription } from '../uploaded-prescription/uploaded-prescription';
import { Address } from '@healbridge/ui';
import { ApiService, ReferralType } from '@healbridge/api';
import { CostFlow } from '@healbridge/shared';

@Component({
  standalone: true,
  selector: 'app-uploaded-prescription-and-address',
  imports: [UploadedPrescription],
  templateUrl: './uploaded-prescription-and-address.html',
  styleUrl: './uploaded-prescription-and-address.css',
})
export class UploadedPrescriptionAndAddress implements OnInit {
  private addressService = inject(Address);
  public api = inject(ApiService);
  public ReferralType =ReferralType;
  public costFlow =CostFlow;
  address = '';
  addressObject = '';

  ngOnInit(): void {
    this.address = this.addressService.address[0]?.address;
    this.addressObject = this.addressService.address[0];
  }
}
