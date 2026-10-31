import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputComponent } from '../input/input';
import { ButtonComponent } from '../button/button.component';
import { IonIcon, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { ActivatedRoute, Router } from '@angular/router';
import { v4 } from 'uuid';

@Component({
  selector: 'ui-add-patient-card-type',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    InputComponent,
    ButtonComponent,
    IonIcon,
    IonText,
  ],
  templateUrl: './add-patient-card-type.html',
  styleUrl: './add-patient-card-type.css',
})
export class AddPatientCardType implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  form: FormGroup;
  loading = false;
  @Input() api: any;
  @Input() backRoute: string;
  @Input() didFacilityMissOnboarding = false;
  @Input() navigateTo: string;
  facilityTypeId: string;
  isEdit = false;
  facilityId: string;
  pharmacyId: string;
  edit: string;
  cardId: string;
  patch = false;

  label = 'Save';

  constructor() {
    addIcons({
      'left-arrow': chevronBackOutline,
    });
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      membershipLimit: [1, Validators.required],
      cardFee: [0, Validators.required],
      cardName: ['', Validators.required],
    });
    this.route.params.subscribe((params: any) => {
      this.facilityTypeId =
        params.pharmacyId ??
        params.professionalId ??
        params.laboratoryId ??
        params.bloodBankId;
      this.edit = params.edit;
      this.facilityId = params.facilityId;
      if (params.edit) {
        if (params.patientCardTypeId != 'new') {
          this.cardId = params.patientCardTypeId;
          this.api
            .getMembershipCardType({
              facilityTypeId: this.facilityTypeId,
              cardId: this.cardId,
            })
            .subscribe((response: any) => {
              this.form.patchValue(response);
            });
        }
      }
      if (params.new) {
        this.patch = true;
      }
    });
  }

  proceed() {
    this.loading = true;

    const { membershipLimit, cardFee, cardName } = this.form.value;
    const cardId = this.cardId ?? v4();

    this.api
      .createMembershipCardType({
        facilityTypeId: this.facilityTypeId,
        cardId: cardId,
        body: {
          facilityTypeId: this.facilityTypeId,
          membershipLimit: Number(membershipLimit),
          cardFee: Number(cardFee),
          cardName: cardName,
        },
      })
      .subscribe({
        next: (response: any) => {
          this.form.patchValue({
            membershipLimit: 1,
            cardFee: 0,
            cardName: '',
          });
          if (this.patch) {
            this.router.navigate([
              'hospital-profile',
              this.facilityId,
              this.facilityTypeId,
            ]);
          } else {
            this.router.navigateByUrl(this.navigateTo);
          }
          this.loading = false;
          Object.keys(this.form.controls).forEach((key) => {
            this.form.get(key)?.setValue('');
          });
        },

        error: (error: any) => {
          this.loading = false;
        },
      });
  }

  goback() {
    if (!this.didFacilityMissOnboarding) {
      if (this.patch) {
        this.router.navigate([
          'hospital-profile',
          this.facilityId,
          this.facilityTypeId,
        ]);
      } else {
        this.router.navigateByUrl(this.navigateTo);
      }
    }
  }
}
