import { Component } from '@angular/core';
import { MsaType } from '@healbridge/api';
import { PageBody } from '@healbridge/ui';
import { MsaRatesTable } from '../msa-rates-table/msa-rates-table';

@Component({
  selector: 'back-office-msa-rates-investment',
  imports: [PageBody, MsaRatesTable],
  templateUrl: './msa-rates-investment.html',
  styleUrl: './msa-rates-investment.css',
})
export class MsaRatesInvestment {
  msaType = MsaType.Investment;
}
