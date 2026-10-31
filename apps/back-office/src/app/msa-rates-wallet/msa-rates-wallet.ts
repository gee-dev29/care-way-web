import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PageBody } from '@healbridge/ui';
import { MsaRatesTable } from '../msa-rates-table/msa-rates-table';
import { MsaType } from '@healbridge/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'back-office-msa-rates-wallet',
  imports: [CommonModule, PageBody, MsaRatesTable],
  templateUrl: './msa-rates-wallet.html',
  styleUrl: './msa-rates-wallet.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MsaRatesWallet {
  msaType = MsaType.Wallet;
}
