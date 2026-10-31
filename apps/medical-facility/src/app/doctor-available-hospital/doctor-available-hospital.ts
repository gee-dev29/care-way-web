import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@care-way/api';
import {
  IonButton,
  IonIcon,
  IonSearchbar,
  IonSkeletonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';

@Component({
  selector: 'medical-facility-doctor-available-hospital',
  imports: [CommonModule, IonIcon, IonSkeletonText, IonSearchbar, IonButton],
  templateUrl: './doctor-available-hospital.html',
  styleUrl: './doctor-available-hospital.css',
})
export class DoctorAvailableHospital implements OnInit {
  isLoading = true;
  private api = inject(ApiService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  professionalId: string;
  filteredFacilities: any[] = [];
  facilities: any[] = [];
  searchTerm = '';

  constructor() {
    addIcons({ chevronBackOutline, chevronForwardOutline });
  }
  ngOnInit() {
    this.activatedRoute.params.subscribe((params: any) => {
      this.professionalId = params.professionalId;

      this.isLoading = true;

      this.api
        .getFacilityTypesProfessionalConnection({
          professionalId: this.professionalId,
        })
        .subscribe((res: any) => {
          this.facilities = res;
          this.filteredFacilities = this.facilities;
          this.isLoading = false;
        });
    });
  }

  onSearch(e: any) {
    const val = (e.target.value || '').toLowerCase().trim();
    this.searchTerm = e.target.value || '';

    if (!val) {
      this.filteredFacilities = this.facilities;
      return;
    }

    this.filteredFacilities = this.facilities.filter((f) =>
      (
        (f.location || '') +
        ' ' +
        (f.facilityType || '') +
        ' ' +
        (f.category || '') +
        ' ' +
        (f.specializations || []).join(' ')
      )
        .toLowerCase()
        .includes(val)
    );
  }

  goBack() {
    this.router.navigate(['/doctor-dashboard', this.professionalId]);
  }

  openHospital(h: any) {
    //
  }
  getVisibleSpecs(h: any) {
  if (h.showAllSpecs) {
    return h.specializations || [];
  }

  return (h.specializations || []).slice(0, 5);
}

toggleSpecs(h: any, event: Event) {
  event.stopPropagation();
  h.showAllSpecs = !h.showAllSpecs;
}
}
