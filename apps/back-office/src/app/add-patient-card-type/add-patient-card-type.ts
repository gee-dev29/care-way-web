import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@healbridge/api';
import { DesktopButton, DesktopInput, FormBody } from '@healbridge/ui';
import { v4 } from 'uuid';

@Component({
  selector: 'shared-add-patient-card-type',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    DesktopInput,
    DesktopButton,
    FormsModule,
    FormBody,
  ],
  templateUrl: './add-patient-card-type.html',
  styleUrl: './add-patient-card-type.css',
})
export class AddPatientCardType implements OnInit {
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private api = inject(ApiService);
  facilityId: string;
  hospitalId: string;
  facilityTypeId: string;
  cardId: string;
  loading = false;
  label = 'Save';
  form: FormGroup;
  cardName = new FormControl('', Validators.required);
  cardFee = new FormControl('', Validators.required);
  membershipLimit = new FormControl('', Validators.required);
  @Output() saved = new EventEmitter<string>();
  @Output() cancelled = new EventEmitter<void>();

  constructor() {
    //
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      // cardId: this.cardId,
      cardName: this.cardName,
      cardFee: this.cardFee,
      membershipLimit: this.membershipLimit,
      // referencedDocumentId: this.referencedDocumentId,
    });
    this.activatedRoute.params.subscribe((params: any) => {
      this.facilityId = params.facilityId;
      this.cardId = params.patientCardTypeId;
      this.hospitalId =
        params.hospitalId ??
        params.professionalId ??
        params.laboratoryId ??
        params.bloodBankId;
      this.form.patchValue({
        referencedDocumentId: this.facilityId,
        // licenseType: FacilityType.Hospital,
      });
      if (this.cardId) {
        this.api
          .getMembershipCardType({
            facilityTypeId: this.hospitalId,
            cardId: this.cardId,
          })
          .subscribe((response: any) => {
            this.form.patchValue(response);
          });
      }
    });
  }
  next() {
    this.loading = true;
    this.api
      .createMembershipCardType({
        facilityTypeId: this.facilityId,
        cardId: v4(),
        body: this.form.value,
      })
      .subscribe(() => {
        // this.router.navigateByUrl(this.onSaveRoute);
        this.saved.emit(this.hospitalId);
      });
  }
  cancel() {
    this.cancelled.emit();
  }
}
