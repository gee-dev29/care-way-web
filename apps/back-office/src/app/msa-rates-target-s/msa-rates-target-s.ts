import { Component } from '@angular/core';
import { PageBody } from '@healbridge/ui';
import { MsaRatesTable } from '../msa-rates-table/msa-rates-table';
import { MsaType } from '@healbridge/api';

@Component({
  selector: 'back-office-msa-rates-target-s',
  imports: [PageBody, MsaRatesTable],
  templateUrl: './msa-rates-target-s.html',
  styleUrl: './msa-rates-target-s.css',
})
export class MsaRatesTargetS {
  msaType = MsaType.TargetS;
}
