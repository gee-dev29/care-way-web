import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, Gender, ProfessionalType } from '@care-way/api';
import {
  ButtonComponent,
  InputComponent,
  ToastService,
} from '@care-way/ui';
import { IonContent, IonIcon, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { v4 } from 'uuid';

@Component({
  selector: 'medical-facility-add-nurse',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonText,
    InputComponent,
    ButtonComponent,
    IonIcon,
  ],
  templateUrl: './add-nurse.html',
  styleUrl: './add-nurse.css',
})
export class AddNurse implements OnInit {
  form: FormGroup;
  loading = false;
  facilityType: string;
  facilityId: string;
  facilityTypeId: string;
  genders: any[] = [];
  professionalId: string;
  edit = false;
  heading = 'Add Nurse'
  label ='Proceed'

  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private toast = inject(ToastService);

  constructor() {
    addIcons({ 'chevron-back-outline': chevronBackOutline });
  }

  ngOnInit(): void {
    this.genders = Object.values(Gender).map((value) => ({
      text: value,
      value,
    }));

    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
    });

    this.activatedRoute.params.subscribe((params: any) => {
      this.facilityId = params.facilityId;
      this.facilityType = params.facilityType;

      if (params.edit) {
        this.edit = true;
        this.heading = 'Edit Nurse'
        this.label = 'Edit'
      }

      if (params.professionalId) {
        this.professionalId = params.professionalId;
      }

      const storedFacilityTypeId = localStorage.getItem('facilityTypeId');
      this.facilityTypeId = storedFacilityTypeId
        ? JSON.parse(storedFacilityTypeId)
        : '';

      if (this.professionalId) {
        this.api
          .getMedicalProfessional({
            professionalId: this.professionalId,
            professionalType: ProfessionalType.Nurse,
          })
          .subscribe((professional: any) => {
            this.form.patchValue({
              firstName: professional.firstName,
              lastName: professional.lastName,
              gender: professional.gender,
              email: professional.email,
              phone: professional.phone ?? professional.phoneNumber,
            });
          });
      }
    });
  }

  goBack(): void {
      if (this.router.url.includes('nurse-dashboard')) {
      this.router.navigateByUrl(
        `/nurse-dashboard/${this.professionalId}/nurse-details`
      );
    } else {
      this.router.navigateByUrl(`/dashboard/nurses`);
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const payload = {
      ...this.form.value,
      email: this.form.value.email.toLowerCase(),
    };

    if (this.edit) {
      this.api
        .createMedicalProfessional({
          professionalId: this.professionalId,
          professionalType: ProfessionalType.Nurse,
          body: payload,
        })
        .subscribe({
          next: () => {
            this.loading = false;
            this.toast.show('Nurse updated successfully', 'success');
            this.goBack()
          },
          error: () => {
            this.loading = false;
          },
        });

      return;
    }

    this.api.getAllUsers({ email: payload.email }).subscribe({
      next: (response: any) => {
        if (response?.data?.length) {
          if (response.data[0].userType === ProfessionalType.Nurse) {
            this.api
              .getMedicalProfessionals({
                professionalType: ProfessionalType.Nurse,
                email: payload.email,
              })
              .subscribe({
                next: (professionalsResponse: any) => {
                  this.api
                    .facilityConnectionRequest({
                      referencedDocumentId:
                        professionalsResponse.data[0].professionalId,
                      body: {
                        connectionId: v4(),
                        facilityTypeId: this.facilityTypeId,
                        connectionType: 'Professional',
                        status: 'Pending',
                      },
                    })
                    .subscribe({
                      next: () => {
                        this.loading = false;
                        this.toast.show(
                          'Invitation sent successfully',
                          'success'
                        );
                        this.router.navigateByUrl('/dashboard/nurses');
                      },
                      error: () => {
                        this.loading = false;
                      },
                    });
                },
                error: () => {
                  this.loading = false;
                },
              });
          } else {
            this.loading = false;
            this.toast.show('Email already exists for another user', 'error');
          }
          return;
        }

        const professionalId = v4();

        this.api
          .createMedicalProfessional({
            professionalId,
            professionalType: ProfessionalType.Nurse,
            body: {
              ...payload,
              professionalId,
            },
          })
          .subscribe({
            next: () => {
              this.api
                .facilityConnectionRequest({
                  referencedDocumentId: professionalId,
                  body: {
                    connectionId: v4(),
                    facilityTypeId: this.facilityTypeId,
                    connectionType: 'Professional',
                    status: 'Pending',
                  },
                })
                .subscribe({
                  next: () => {
                    this.loading = false;
                    this.toast.show('Invitation sent successfully', 'success');
                    this.router.navigateByUrl('/dashboard/nurses');
                  },
                  error: () => {
                    this.loading = false;
                  },
                });
            },
            error: () => {
              this.loading = false;
            },
          });
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}