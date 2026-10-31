import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiService, ProfessionalType } from '@healbridge/api';
import { PageBody, MedicalProfessionalDetailsCard, Tab } from '@healbridge/ui';
import { Observable } from 'rxjs';

@Component({
  selector: 'back-office-laboratory-professional-details',
  imports: [CommonModule, PageBody, MedicalProfessionalDetailsCard, Tab],
  templateUrl: './laboratory-professional-details.html',
  styleUrl: './laboratory-professional-details.css',
})
export class LaboratoryProfessionalDetails implements OnInit {
  api = inject(ApiService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  activeTab = 0;
  totalRecords = 0;
  professionalId: string;
  cardHeading = 'Laboratory Professional Details';
  laboratory$: Observable<any>;
  tabs = [{ title: 'Details', value: 0, content: 'Details' }];

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params[string]) => {
      this.professionalId = params.professionalId;
      this.getLaboratoryProfessional(this.professionalId);
    });
  }

  getLaboratoryProfessional(professionalId: string) {
    this.laboratory$ = this.api.getMedicalProfessional({
      professionalId,
      professionalType: ProfessionalType.LaboratoryStaff,
    });
  }

  back() {
    this.router.navigate(['list-all-laboratory-professionals']);
  }
}
