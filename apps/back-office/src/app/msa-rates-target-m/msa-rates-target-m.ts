import { Component } from '@angular/core';
import { PageBody } from '@care-way/ui';
import { MsaRatesTable } from '../msa-rates-table/msa-rates-table';
import { MsaType } from '@care-way/api';

@Component({
  selector: 'back-office-msa-rates-target-m',
  imports: [PageBody, MsaRatesTable],
  templateUrl: './msa-rates-target-m.html',
  styleUrl: './msa-rates-target-m.css',
})
export class MsaRatesTargetM {
  msaType = MsaType.TargetM;
}
