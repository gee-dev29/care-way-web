import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  Input,
  OnChanges,
} from '@angular/core';
import {
  IonText,
  IonIcon,
  IonCard,
  IonCardContent,
  IonRadio,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { ToastService } from '../toast';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '../button/button.component';
import { PlusIconComponent } from '../plus-icon-component/plus-icon-component';
@Component({
  selector: 'ui-shared-empty-bank',
  imports: [
    IonText,
    CommonModule,
    IonCard,
    IonCardContent,
    ReactiveFormsModule,
    IonIcon,
    IonRadio,
    ButtonComponent,
    PlusIconComponent,
  ],
  templateUrl: './shared-empty-bank.html',
  styleUrl: './shared-empty-bank.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedEmptyBank implements OnChanges {
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(ToastService);
  @Input() facilityType: string;
  @Input() FacilityType: any;
  @Input() route: string;
  @Input() backRoute: string;
  @Input() api: any;
  @Input() bankRoute: any;
  facilityId: string;
  pharmacyId: string;
  loading = false;
  bank: any[] = [];
  bankSelected: any;
  label = 'Continue';
  edit = '';

  ngOnChanges(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.facilityId = params.facilityId;
      this.pharmacyId =
        params.pharmacyId ?? params.laboratoryId ?? params.bloodBankId;
      this.edit = params.edit;
      this.getBanks();
    });

    addIcons({
      'left-arrow': chevronBackOutline,
    });
  }

  goback() {
    this.router.navigateByUrl(this.backRoute);
  }

  addMore() {
    this.router.navigateByUrl(this.route);
  }

  selectCard(bank: any, index: number) {
    this.bank[index].check = !this.bank[index].check;

    this.bank.forEach((b: any, i: number) => {
      if (i !== index) b.check = false;
    });
    if (this.bank[index].check) {
      this.bankSelected = {
        bankAccountId: bank.bankAccountId,
      };
    } else {
      this.bankSelected = null;
    }
  }

  getBanks() {
    this.api
      .getBankAccount({
        referencedDocumentId: this.facilityId,
      })
      .subscribe((res: any[]) => {
        this.bank = res.map((bank) => ({
          ...bank,
          check: false,
        }));
        if (this.edit?.length) {
          this.bankSelected = [...this.bank];
        }
      });
  }

  checkIfAnyIsEmpty(): boolean {
    return this.bank.some((b) => b.check === true);
  }

  proceed() {
    this.loading = true;
    this.label = 'Please Wait';
    this.api
      .addFacilityTypeBankAccount({
        facilityTypeId: this.pharmacyId,
        facilityType: this.facilityType,
        body: this.bankSelected,
      })
      .subscribe({
        next: () => {
          this.toast.show('Bank Account added successfully', 'success');
          this.router.navigateByUrl(this.bankRoute);
        },
        error: () => {
          this.loading = false;
        },
        complete: () => {
          this.label = 'Continue';
          this.loading = false;
        },
      });
  }
}
