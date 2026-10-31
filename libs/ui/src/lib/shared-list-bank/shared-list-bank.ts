import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { IonImg, IonText, IonIcon, IonRadio, IonContent } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '../button/button.component';
import { ToastService } from '../toast';

@Component({
  selector: 'ui-shared-list-bank',
  imports: [
    IonImg,
    IonText,
    CommonModule,
    IonIcon,
    ReactiveFormsModule,
    ButtonComponent,
    IonRadio,
    IonContent
],
  templateUrl: './shared-list-bank.html',
  styleUrl: './shared-list-bank.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedListBank implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(ToastService);

  @Input() api: any;
  @Input() moreRoute: string;
  @Input() route: string;
  @Input() backROute: string;
  @Input() facilityType: string;
  @Input() FacilityType: any;

  facilityId: string;
  pharmacyId: string;
  edit = '';
  bankSelected: any;
  label = 'Continue';
  loading = false;

  bank: any[] = [];

  ngOnInit(): void {
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
          this.router.navigateByUrl(this.route);
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

  addMore() {
    this.router.navigateByUrl(this.moreRoute);
  }

  checkIfAnyIsEmpty(): boolean {
    return this.bank.some((b) => b.check === true);
  }

  goback() {
    this.router.navigateByUrl(this.route);
  }
}
