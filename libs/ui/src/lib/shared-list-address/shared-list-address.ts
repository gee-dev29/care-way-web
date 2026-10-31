import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import {
  IonImg,
  IonText,
  IonIcon,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '../button/button.component';
import { ToastService } from '../toast';
import { Address } from '../address';

@Component({
  selector: 'ui-shared-list-address',
  imports: [
    IonImg,
    IonText,
    CommonModule,
    IonIcon,
    ReactiveFormsModule,
    ButtonComponent,
  ],
  templateUrl: './shared-list-address.html',
  styleUrl: './shared-list-address.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedListAddress implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(ToastService);
  private newAddress = inject(Address);

  @Input() api: any;
  @Input() route: string;
  @Input() moreRoute: string;
  @Input() FacilityType: any;
  @Input() facilityType: string;
  patch = false;
  facilityId: string;
  pharmacyId: string;
  edit = '';
  label = 'Continue';
  loading = false;

  addressSelected: any[] = [];
  address: any[] = [];

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.facilityId = params.facilityId;
      this.pharmacyId =
        params.pharmacyId ?? params.laboratoryId ?? params.bloodBankId;
      this.edit = params.edit;
      if (params.patch) {
        this.patch = true;
        this.api
          .getFacilityTypeAddresses({
            facilityType: this.facilityType,
            facilityTypeId: this.pharmacyId,
          })
          .subscribe((response: any) => {
            response.forEach((address: any) => {
              address.check = true;
              this.addressSelected.push(address);
            });
          });
      }
      this.getAddresses();
    });

    addIcons({
      'left-arrow': chevronBackOutline,
    });
  }

  getAddresses() {
    this.api
      .getAddresses({ referencedDocumentId: this.facilityId })
      .subscribe((response: any[]) => {
        if (this.patch && this.addressSelected?.length > 0) {
          const selectedIds = new Set(
            this.addressSelected.map((a) => a.addressId)
          );
          this.address = response.map((addr) => ({
            ...addr,
            check: selectedIds.has(addr.addressId),
          }));
        } else {
          this.address = response;
        }
      });
  }

  proceed() {
    this.loading = true;
    this.label = 'Please Wait';
    const addressId: any = [];
    this.addressSelected.forEach((address: any, index: any) => {
      addressId.push(address.addressId);
    });
    this.api
      .addFacilityTypeAddresses({
        facilityTypeId: this.pharmacyId,
        facilityType: this.facilityType,
        body: { addressIds: addressId },
      })
      .subscribe({
        next: () => {
          this.toast.show('Address added successfully', 'success');
          if (this.patch) {
            this.selectType(
              this.facilityType,
              this.facilityId,
              this.pharmacyId
            );
          } else {
            this.router.navigateByUrl(this.route);
          }
          this.label = 'Continue';
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  selectType(type: any, facilityId: any, facilityTypeId: any) {
    switch (type) {
      case this.FacilityType.Pharmacy:
        this.router.navigate(['pharm-profile', facilityId, facilityTypeId]);

        break;
      case this.FacilityType.Hospital:
        this.router.navigate(['hospital-profile', facilityId, facilityTypeId]);

        break;
      case this.FacilityType.Laboratory:
        this.router.navigate([
          'laboratory-profile',
          facilityId,
          facilityTypeId,
        ]);

        break;
      case this.FacilityType.Radiology:
        this.router.navigate(['radiology-profile', facilityId, facilityTypeId]);

        break;
      case this.FacilityType['Blood Bank']:
        this.router.navigate([
          'blood-bank-profile',
          facilityId,
          facilityTypeId,
        ]);
        break;
      default:
        break;
    }
  }

  selectCard(address: any, index: number) {
    this.address[index].check = !this.address[index].check;

    if (this.address[index].check) {
      this.addressSelected.push(address);
    } else {
      this.addressSelected = this.addressSelected.filter((a) => a !== address);
    }
  }

  addMore() {
    if (this.patch) {
      this.router.navigateByUrl(`${this.moreRoute}?patch=patch`);
    } else {
      this.router.navigateByUrl(this.moreRoute);
    }
  }

  checkIfAnyIsEmpty(): boolean {
    return this.address.some((a) => a.check === true);
  }

  // goback() {
  //   this.router.navigate([
  //     '/pharmacy-onboarding',
  //     this.facilityId,
  //     this.pharmacyId,
  //     'pharm-bank-list',
  //   ]);
  // }
}
