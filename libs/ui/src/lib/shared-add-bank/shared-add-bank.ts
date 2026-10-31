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
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { v4 } from 'uuid';
import { InputComponent } from '../input/input';
import { ButtonComponent } from '../button/button.component';
import { ToastService } from '../toast';
import { LimitSize } from '../models/action.model';
@Component({
  selector: 'ui-shared-add-bank',
  imports: [
    IonText,
    CommonModule,
    IonIcon,
    ReactiveFormsModule,
    InputComponent,
    ButtonComponent,
    InputComponent,
  ],
  templateUrl: './shared-add-bank.html',
  styleUrl: './shared-add-bank.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedAddBank implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(ToastService);
  @Input() api: any;
  @Input() route: any;
  @Input() backRoute: any;
  @Input() facilityType: any;
  edit = '';
  didFacilityMissOnboarding = false;
  facilityId: string;
  pharmacyId: string;
  riderId: string;
  agentId: string;
  loading = false;
  isBank = false;
  @Input() label = 'Continue';
  private formBuilder = inject(FormBuilder);
  form: FormGroup;
  bankAccountId = new FormControl(v4(), [Validators.required]);
  referencedDocumentId = new FormControl('', [Validators.required]);
  accountNumber = new FormControl('', [Validators.required]);
  bank = new FormControl('', Validators.required);
  accountName = new FormControl('', Validators.required);
  professionalId: string;
  banks: any = [];

  constructor() {
    addIcons({ chevronBackOutline });
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      bankAccountId: this.bankAccountId,
      referencedDocumentId: this.referencedDocumentId,
      accountNumber: this.accountNumber,
      bank: this.bank,
      accountName: this.accountName,
    });
    this.activatedRoute.params.subscribe((params: any) => {
      this.facilityId = params.facilityId;
      this.pharmacyId =
        params.pharmacyId ??
        params.professionalId ??
        params.laboratoryId ??
        params.bloodBankId;
      this.edit = params.edit;
      this.riderId = params.riderId;
      this.agentId = params.agentId;
      this.professionalId = params.professionalId;
      this.form.patchValue({
        referencedDocumentId:
          this.facilityId ??
          this.riderId ??
          this.professionalId ??
          this.agentId,
      });
      if (params.bankAccountId || this.edit) {
        this.api
          .getBankAccount({
            referencedDocumentId:
              this.facilityId ??
              this.riderId ??
              this.professionalId ??
              this.agentId,
          })
          .subscribe((response: any) => {
            response.forEach((bank: any) => {
              if (bank.bankAccountId === params.bankAccountId) {
                this.form.patchValue(bank);
              }
            });
          });
      }
    });
    addIcons({
      'left-arrow': chevronBackOutline,
    });
    this.activatedRoute.queryParams.subscribe((params: any) => {
      if (params.error) {
        this.didFacilityMissOnboarding = true;
      }
    });
    this.api
      .getBanks({ skip: 0, limit: LimitSize.DropDown })
      .subscribe((response: any) => {
        this.banks = response.results.map((bank: any) => ({
          ...bank,
          text: bank.bankName,
          value: bank.bankName,
        }));
      });
  }

  proceed() {
    this.loading = true;
    this.label = 'Please Wait';
    const { bankName, bankCode } = this.form.value.bank;
    this.api
      .addBankAccount({
        referencedDocumentId: this.form.value.referencedDocumentId,
        body: { ...this.form.value, bankCode, bank: bankName },
      })
      .subscribe({
        next: () => {
          Object.keys(this.form.controls).forEach((key) => {
            this.form.get(key)?.setValue('');
          });
          if (this.edit) {
            this.toast.show('Bank Account updated successfully', 'success');
            this.router.navigateByUrl(this.route);
            return;
          } else {
            this.toast.show('Bank Account added successfully', 'success');
            if (this.didFacilityMissOnboarding) {
              this.router.navigateByUrl('/dashboard/home');
              return;
            }
            this.router.navigateByUrl(this.route);
          }
        },
        error: () => {
          this.label = 'Continue';
          this.loading = false;
        },
        complete: () => {
          this.label = 'Continue';
          this.loading = false;
        },
      });
  }

  goback() {
    if (!this.didFacilityMissOnboarding) {
      this.router.navigateByUrl(this.route);
    }
  }

  isServiceNameClicked() {
    this.isBank = true;
  }

  offServiceNameClicked() {
    this.isBank = false;
  }
}
