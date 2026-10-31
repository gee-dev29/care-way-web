import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ApiService,
  FacilityType,
  Gender,
  ProfessionalType,
} from '@healbridge/api';
import { Cadre, ConversionService, Specialization } from '@healbridge/shared';
import {
  ButtonComponent,
  InputCalendar,
  InputComponent,
  Item,
  ToastService,
} from '@healbridge/ui';
import { IonContent, IonIcon, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import moment from 'moment';
import { v4 } from 'uuid';

@Component({
  standalone: true,
  selector: 'medical-facility-add-doctor-license',
  imports: [
    IonContent,
    IonText,
    IonIcon,
    CommonModule,
    ButtonComponent,
    InputCalendar,
    InputComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './add-doctor-license.html',
  styleUrl: './add-doctor-license.css',
})
export class AddDoctorLicense implements OnInit {
  constructor() {
    addIcons({ 'chevron-back-outline': chevronBackOutline });
  }
  form: FormGroup;
  loading = false;
  private fb = inject(FormBuilder);
  private conversion = inject(ConversionService);
  private api = inject(ApiService);
  private router = inject(Router);
  private toast = inject(ToastService);
  private activatedRoute = inject(ActivatedRoute);
  professionalId: string;
  facilityId: any;
  facilityType: any;
  location = inject(Location);
  max: any = '2025-01-01';
  step = 2;
  edit = false;
  totalStep = 2;
  facilityTypeId: string;

  ngOnInit(): void {
    this.form = this.fb.group({
      licenseId: [v4(), Validators.required],
      licenseNumber: ['', Validators.required],
      licenseType: ['Doctor', Validators.required],
      issueDate: [moment().format('MMMM D, YYYY'), Validators.required],
      expiryDate: [
        moment().add(30, 'days').format('MMMM D, YYYY'),
        Validators.required,
      ],
    });
    this.activatedRoute.params.subscribe((params: any) => {
      this.facilityId = params.facilityId;
      this.facilityType = params.facilityType;
      if (params.professionalId) {
        this.professionalId = params.professionalId;
      }
      if (params.edit) {
        this.edit = true;
      }
      if (!this.router.url.includes('edit-doctor-license')) {
        const facilityType = JSON.parse(
          localStorage.getItem('facilityType') as any
        );
        if (facilityType === this.facilityType) {
          switch (this.facilityType) {
            case FacilityType.Hospital:
              this.facilityTypeId = JSON.parse(
                localStorage.getItem('facilityTypeId') as any
              );
              break;
          }
        }
      }
      if (params.edit) {
        this.calculateDate();
        this.step = Number(params.step);
        this.api
          .getPracticeLicenses({ referencedDocumentId: this.professionalId })
          .subscribe((license: any) => {
            this.form.patchValue(license[0]);
          });
      } else {
        this.step = 2;
      }
    });
  }

  goBack() {
    if (this.router.url.includes('edit-doctor-license')) {
      this.router.navigate([
        'doctor-dashboard',
        this.professionalId,
        'doctor-profile',
      ]);
    } else {
      if (this.edit) {
        this.router.navigate([
          `/dashboard/doctor-profile`,
          this.facilityType,
          this.facilityId,
          this.professionalId,
        ]);
      } else {
        this.router.navigate([
          `/dashboard/add-doctor`,
          this.facilityType,
          this.facilityId,
        ]);
      }
    }
  }

  onNext(): void {
    this.loading = true;
    if (this.router.url.includes('edit-doctor-license')) {
      this.api
        .addPracticeLicense({
          referencedDocumentId: this.professionalId,
          body: {
            ...this.form.value,
            issueDate: moment(this.form.value.issueDate).format('YYYY-MM-DD'),
            expiryDate: moment(this.form.value.expiryDate).format('YYYY-MM-DD'),
            licenseType: ProfessionalType.Doctor,
          },
        } as any)
        .subscribe({
          next: () => {
            this.loading = false;
            this.router.navigate([
              'doctor-dashboard',
              this.professionalId,
              'upload-license',
            ]);
            return;
          },
          error: () => {
            this.loading = false;
          },
        });
    } else {
      this.reuse();
    }
  }

  reuse() {
    const facilityType = JSON.parse(
      localStorage.getItem('facilityType') as any
    );
    if (facilityType === this.facilityType) {
      switch (this.facilityType) {
        case FacilityType.Hospital:
          this.api
            .addPracticeLicense({
              referencedDocumentId: this.professionalId,
              body: {
                ...this.form.value,
                issueDate: moment(this.form.value.issueDate).format(
                  'YYYY-MM-DD'
                ),
                expiryDate: moment(this.form.value.expiryDate).format(
                  'YYYY-MM-DD'
                ),
                licenseType: ProfessionalType.Doctor,
              },
            } as any)
            .subscribe({
              next: () => {
                this.loading = false;

                this.router.navigateByUrl(
                  `dashboard/upload-license/${this.facilityType}/${this.facilityId}/${this.professionalId}`
                );
              },
              error: () => {
                this.loading = false;
              },
            });
          break;
      }
    }
  }

  setStartDate(date: Date) {
    this.form.controls['issueDate'].setValue(date);
  }

  setExpiryDate(date: Date) {
    this.form.controls['expiryDate'].setValue(date);
  }

  calculateDate() {
    this.max = moment(this.form.value.issueDate)
      .add(1, 'years')
      .format('YYYY-MM-DD');
  }
}
