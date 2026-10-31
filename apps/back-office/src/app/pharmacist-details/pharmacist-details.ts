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
  selector: 'back-office-pharmacist-details',
  imports: [PageBody, CommonModule, Tab, MedicalProfessionalDetailsCard],
  templateUrl: './pharmacist-details.html',
  styleUrl: './pharmacist-details.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PharmacistDetails implements OnInit {
  api = inject(ApiService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  activeTab = 0;
  totalRecords = 0;
  professionalId: string;
  cardHeading = 'Pharmacist Details';
  pharmacist$: Observable<any>;
  tabs = [{ title: 'Details', value: 0, content: 'Details' }];

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params[string]) => {
      this.professionalId = params.professionalId;
      this.getPharmacist(this.professionalId);
    });
  }

  getPharmacist(professionalId: string) {
    this.pharmacist$ = this.api.getMedicalProfessional({
      professionalId,
      professionalType: ProfessionalType.Pharmacist,
    });
  }

  back() {
    this.router.navigate(['list-all-pharmacists']);
  }
}
