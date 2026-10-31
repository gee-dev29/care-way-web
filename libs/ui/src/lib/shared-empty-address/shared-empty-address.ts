import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { IonText, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { ToastService } from '../toast';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '../button/button.component';
import { forkJoin, map, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { PlusIconComponent } from '../plus-icon-component/plus-icon-component';
@Component({
  selector: 'ui-shared-empty-address',
  imports: [
    IonText,
    CommonModule,
    IonIcon,
    ReactiveFormsModule,
    ButtonComponent,
    PlusIconComponent,
  ],
  templateUrl: './shared-empty-address.html',
  styleUrl: './shared-empty-address.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedEmptyAddress implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(ToastService);
  @Input() api: any;
  @Input() facilityType: string;
  @Input() FacilityType: any;
  @Input() route: string;
  @Input() backRoute: string;
  @Input() navigateTo: string;
  patch = false;
  private destroy$ = new Subject<void>();
  facilityId: string;
  pharmacyId: string;
  loading = false;
  oneAddress: any;
  edit = '';
  label = 'Continue';

  addressSelected: any[] = [];
  address: any[] = [];

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        takeUntil(this.destroy$),
        switchMap((params: any) => {
          this.addressSelected = [];
          this.facilityId = params.facilityId;
          this.pharmacyId =
            params.pharmacyId ?? params.laboratoryId ?? params.bloodBankId;
          this.edit = params.edit;
          this.patch = !!params.patch;

          return forkJoin({
            allAddresses: this.api.getAddresses({
              referencedDocumentId: this.facilityId,
            }),
            patchAddresses: this.patch
              ? this.api
                  .getFacilityTypeById({
                    facilityType: this.facilityType,
                    facilityId: this.facilityId,
                    facilityTypeId: this.pharmacyId,
                  })
                  .pipe(
                    tap((res: any) => (this.oneAddress = res.address)),
                    map((response: any) => [response.address])
                  )
              : of([]),
          });
        })
      )
      .subscribe(({ allAddresses, patchAddresses }: any) => {
        if (this.patch) {
          this.addressSelected = patchAddresses.map((addr: any) => ({
            ...addr,
          }));
          const patchIds = new Set([this.oneAddress]);
          this.address = allAddresses.map((addr: any) => ({
            ...addr,
            check: patchIds.has(addr.googlePlaceId),
          }));
        } else {
          this.address = allAddresses.map((addr: any) => ({
            ...addr,
            check: false,
          }));
        }
      });

    addIcons({
      'left-arrow': chevronBackOutline,
    });
  }

  goback() {
    if (this.patch) {
      this.selectType(this.facilityType, this.facilityId, this.pharmacyId);
    } else {
      this.router.navigateByUrl(this.backRoute);
    }
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
      .addFacilityTypeAddress({
        facilityTypeId: this.pharmacyId,
        facilityType: this.facilityType,
        body: { addressId: addressId[0] },
      })
      .subscribe({
        next: () => {
          if (this.patch) {
            this.selectType(
              this.facilityType,
              this.facilityId,
              this.pharmacyId
            );
          } else {
            if (this.facilityType === this.FacilityType.Hospital) {
              this.toast.show('Address added successfully', 'success');
            } else {
              this.toast.show(
                `${this.facilityType} onboarded successfully`,
                'success'
              );
            }
            this.router.navigateByUrl(this.navigateTo);
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
    this.toast.show('Address updated successfully', 'success');
    switch (type) {
      case this.FacilityType.Pharmacy:
        this.router.navigate([
          '/dashboard/pharm-profile',
          facilityId,
          facilityTypeId,
        ]);

        break;
      case this.FacilityType.Hospital:
        this.router.navigate([
          '/dashboard/hospital-profile',
          facilityId,
          facilityTypeId,
        ]);

        break;
      case this.FacilityType.Laboratory:
        this.router.navigate([
          '/dashboard/laboratory-profile',
          facilityId,
          facilityTypeId,
        ]);

        break;
      case this.FacilityType.Radiology:
        this.router.navigate([
          '/dashboard/radiology-profile',
          facilityId,
          facilityTypeId,
        ]);

        break;
      case this.FacilityType['Blood Bank']:
        this.router.navigate([
          '/dashboard/blood-bank-profile',
          facilityId,
          facilityTypeId,
        ]);
        break;
      default:
        break;
    }
  }

  selectCard(address: any, index: number) {
    this.address.forEach((item: any) => {
      item.check = false;
    });

    this.address[index].check = true;

    this.addressSelected = [address];
  }

  addMore() {
    if (this.patch) {
      this.router.navigateByUrl(`${this.route}?patch=patch`);
    } else {
      this.router.navigateByUrl(this.route);
    }
  }

  checkIfAnyIsEmpty(): boolean {
    return this.address.some((a) => a.check === true);
  }

  ionViewWillLeave() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
