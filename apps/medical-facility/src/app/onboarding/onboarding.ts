import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import {
  IonCard,
  IonCardContent,
  IonText,
  IonIcon,
  IonCheckbox,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { ButtonComponent, PlusIconComponent } from '@care-way/ui';
import {
  ConversionService,
  FacilityType,
  FacilityTypeService,
} from '@care-way/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { v4 } from 'uuid';
import { ApiService } from '@care-way/api';

@Component({
  selector: 'medical-facility-onboarding',
  imports: [
    ButtonComponent,
    IonText,
    CommonModule,
    IonCard,
    IonCardContent,
    IonIcon,
    IonCheckbox,
    PlusIconComponent,
  ],
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Onboarding implements OnInit {
  private conversionService = inject(ConversionService);
  private facilityService = inject(FacilityTypeService);
  private api = inject(ApiService);
  facilityCategories: any = [];
  isFacilityModalOpen = false;
  selected = FacilityType.Pharmacy;
  selectedFacilityType: any;
  accounts: any = [];
  firstCategory: any;
  FacilityTypes = FacilityType;
  private router = inject(Router);
  public activatedRoute = inject(ActivatedRoute);
  facilityId: string;
  firstData: any;
  facilityData: any = [];

  ngOnInit(): void {
    this.conversionService.convert(FacilityType, this.facilityCategories);
    this.firstCategory = FacilityType.Pharmacy;

    this.activatedRoute.params.subscribe((params: any) => {
      this.facilityId = params.facilityId;
      this.api
        .getFacilityTypesOfFacility({ facilityId: this.facilityId } as any)
        .subscribe((response: any) => {
          this.facilityData = response;
          this.facilityCategories = this.facilityCategories.map((type: any) => {
            const match = response.find(
              (finder: any) => finder.facilityType === type.text
            );

            if (match) {
              return {
                ...type,
                ...match,
                check: true,
              };
            }

            return type;
          });
          this.selected = this.facilityCategories[0].facilityType;
        });
    });
  }
  getIconBg(type: string): string {
    switch (type) {
      case 'Pharmacy':
        return '#EFE3EE';
      case 'Hospital':
        return '#D4D6EA';
      case 'Laboratory':
        return '#D0EAFF';
      case 'Radiology':
        return '#D2D2A0';
      case 'Blood Bank':
        return '#F76F6F';
      default:
        return '#e0e0e0';
    }
  }

  proceed() {
    this.firstData =
      this.facilityCategories.find((category: any) => category.check);
    this.selectAFacilityType(this.firstData);
  }

  prevent(event: any) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  selectType(type: any) {
    this.selected = type.text;
    this.facilityService.setFacilityType(type.text);
    switch (type.text) {
      case FacilityType.Pharmacy:
        if (type.check) {
          this.IsSelectedAndOnboarded();
          this.isFacilityModalOpen = true;
        } else {
          this.router.navigate([
            '/dashboard/pharmacy-onboarding',
            this.facilityId,
            v4(),
          ]);
        }
        break;
      case FacilityType.Hospital:
        if (type.check) {
          this.IsSelectedAndOnboarded();
          this.isFacilityModalOpen = true;
        } else {
          this.router.navigate([
            '/dashboard/hospital-onboarding',
            this.facilityId,
            v4(),
          ]);
        }
        break;
      case FacilityType.Laboratory:
        if (type.check) {
          this.IsSelectedAndOnboarded();
          this.isFacilityModalOpen = true;
        } else {
          this.router.navigate([
            '/dashboard/laboratory-onboarding',
            this.facilityId,
            v4(),
          ]);
        }
        break;
      case FacilityType.Radiology:
        if (type.check) {
          this.IsSelectedAndOnboarded();
          this.isFacilityModalOpen = true;
        } else {
          this.router.navigate([
            '/dashboard/radiology-onboarding',
            this.facilityId,
            v4(),
          ]);
        }
        break;
      case FacilityType['Blood Bank']:
        if (type.check) {
          this.IsSelectedAndOnboarded();
          this.isFacilityModalOpen = true;
        } else {
          this.router.navigate([
            '/dashboard/blood-bank-onboarding',
            this.facilityId,
            v4(),
          ]);
        }
        break;
      default:
        if (type.check) {
          this.IsSelectedAndOnboarded();
          this.isFacilityModalOpen = true;
        } else {
          this.router.navigateByUrl('/dashboard/blood-bank-onboarding');
        }
        break;
    }
  }

  IsSelectedAndOnboarded() {
    this.accounts = this.facilityData
      .filter((res: any) => res.facilityType === this.selected)
      .map((res: any, index: any) => {
        if (index === 0) {
          this.selectedFacilityType =
            res.facilityName + ' ' + res.facilityType + ' ' + (index + 1);
        }
        res.check = this.selectedFacilityType === res.name ? true : false;
        return res;
      });
  }

  checkIfAnyIsEmpty(): any {
    let result = false;
    this.facilityCategories.filter((checked: any, index: any) => {
      if (checked.check == true) {
        result = true;
      }
      return result;
    });
    return result;
  }

  extraOnboarding() {
    this.isFacilityModalOpen = false;
    setTimeout(() => {
      switch (this.selected) {
        case FacilityType.Pharmacy:
          this.router.navigate([
            '/dashboard/pharmacy-onboarding',
            this.facilityId,
            v4(),
          ]);

          break;
        case FacilityType.Hospital:
          this.router.navigate([
            '/dashboard/hospital-onboarding',
            this.facilityId,
            v4(),
          ]);

          break;
        case FacilityType.Laboratory:
          this.router.navigate([
            '/dashboard/laboratory-onboarding',
            this.facilityId,
            v4(),
          ]);

          break;
        case FacilityType.Radiology:
          this.router.navigate([
            '/dashboard/radiology-onboarding',
            this.facilityId,
            v4(),
          ]);

          break;
        case FacilityType['Blood Bank']:
          this.router.navigate([
            '/dashboard/blood-bank-onboarding',
            this.facilityId,
            v4(),
          ]);

          break;
        default:
          this.router.navigateByUrl('/dashboard/blood-bank-onboarding');
          break;
      }
    }, 100);
  }

  selectAFacilityType(facilityType: any) {
    this.isFacilityModalOpen = false;
    this.facilityService.setFacilityType(facilityType.facilityType);
    localStorage.setItem(
      'facilityTypeId',
      JSON.stringify(
        facilityType.pharmacyId ??
          facilityType.radiologyId ??
          facilityType.hospitalId ??
          facilityType.bloodBankId ??
          facilityType.laboratoryId
      )
    );
    setTimeout(() => {
      this.router.navigate(['/dashboard']);
    }, 100);
  }
}
