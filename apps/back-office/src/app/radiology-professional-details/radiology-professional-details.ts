import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiService, ProfessionalType } from '@healbridge/api';
import { PageBody, Tab, MedicalProfessionalDetailsCard } from '@healbridge/ui';
import { Observable } from 'rxjs';

@Component({
  selector: 'back-office-radiology-professional-details',
  imports: [CommonModule, PageBody, Tab, MedicalProfessionalDetailsCard],
  templateUrl: './radiology-professional-details.html',
  styleUrl: './radiology-professional-details.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RadiologyProfessionalDetails implements OnInit {
  api = inject(ApiService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  activeTab = 0;
  totalRecords = 0;
  professionalId: string;
  cardHeading = 'Radiology Professional Details';
  radiology$: Observable<any>;
  tabs = [{ title: 'Details', value: 0, content: 'Details' }];

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params[string]) => {
      this.professionalId = params.professionalId;
      this.getRadiologyProfessional(this.professionalId);
    });
  }

  getRadiologyProfessional(professionalId: string) {
    this.radiology$ = this.api.getMedicalProfessional({
      professionalId,
      professionalType: ProfessionalType.RadiologyStaff,
    });
  }

  back() {
    this.router.navigate(['list-all-radiology-professionals']);
  }
}
