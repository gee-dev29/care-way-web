import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiService, ProfessionalType } from '@healbridge/api';
import {
  PageBody,
  DesktopButton,
  Tab,
  MedicalProfessionalDetailsCard,
} from '@healbridge/ui';
import { Observable } from 'rxjs';

@Component({
  selector: 'back-office-bloodbank-professional-details',
  imports: [PageBody, Tab, CommonModule, MedicalProfessionalDetailsCard],
  templateUrl: './bloodbank-professional-details.html',
  styleUrl: './bloodbank-professional-details.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BloodbankProfessionalDetails implements OnInit {
  api = inject(ApiService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  activeTab = 0;
  totalRecords = 0;
  professionalId: string;
  cardHeading = 'Blood Bank Professional Details';
  bloodBank$: Observable<any>;
  tabs = [{ title: 'Details', value: 0, content: 'Details' }];

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params[string]) => {
      this.professionalId = params.professionalId;
      this.getBloodBankProfessional(this.professionalId);
    });
  }

  getBloodBankProfessional(professionalId: string) {
    this.bloodBank$ = this.api.getMedicalProfessional({
      professionalId,
      professionalType: ProfessionalType.BloodBankStaff,
    });
  }

  back() {
    this.router.navigate(['list-all-blood-bank-professionals']);
  }
}
