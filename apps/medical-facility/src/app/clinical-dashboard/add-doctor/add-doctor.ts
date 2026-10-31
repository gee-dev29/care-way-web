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
import { Cadre, ConversionService } from '@healbridge/shared';
import {
  ButtonComponent,
  InputComponent,
  Item,
  ToastService,
} from '@healbridge/ui';
import { IonContent, IonIcon, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import moment from 'moment';
import { forkJoin } from 'rxjs';
import { v4 } from 'uuid';

@Component({
  standalone: true,
  selector: 'medical-facility-add-doctor',
  imports: [
    IonContent,
    IonText,
    IonIcon,
    CommonModule,
    ButtonComponent,
    InputComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './add-doctor.html',
  styleUrl: './add-doctor.css',
})
export class AddDoctor implements OnInit {
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
  step = 1;
  edit = false;
  totalStep = 2;
  genders: any = [];
  cadre: Item[] = [];
  specializations: Item[] = [];
  settlementOptions: Item[] = [
    { text: 'Hospital Only', value: 'Hospital Only' },
    { text: 'Hospital and Doctor', value: 'Hospital and Doctor' },
  ];
  facilityTypeId: string;
  isCadre = false;
  isSpecialization = false;
  isVirtualSettlement = false;
  isPhysicalSettlement = false;

  ngOnInit(): void {
    this.conversion.convert(Cadre, this.cadre);
    this.conversion.convert(Gender, this.genders);
    this.api.getHospitalSpecializations().subscribe((res: any) => {
      this.api.getHospitalSpecializations().subscribe((res: any[]) => {
        this.specializations = res.map((item) => ({
          text: item.name,
          value: item.hospitalSpecializationId,
        }));
      });
    });

    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      cadre: ['', Validators.required],
      specialization: ['', Validators.required],
      feeId: [v4(), Validators.required],
      virtualConsultation: [false, Validators.required],
      virtualConsultationFee: [0, Validators.required],
      physicalConsultationFee: [0, Validators.required],
      virtualHospitalFee: [0, Validators.required],
      physicalHospitalFee: [0, Validators.required],
      virtualConsultationSettlement: ['Hospital Only', Validators.required],
      physicalConsultationSettlement: ['Hospital Only', Validators.required],
    });
    this.activatedRoute.params.subscribe((params: any) => {
      this.facilityId = params.facilityId;
      this.facilityType = params.facilityType;
      if (params.edit) {
        this.edit = true;
      }
      if (params.professionalId) {
        this.professionalId = params.professionalId;
      }
      if (!this.router.url.includes('edit-doctor')) {
        this.api
          .getFacilityTypesOfFacility({ facilityId: this.facilityId })
          .subscribe((res: any) => {
            res.map((facility: any) => {
              if (facility.facilityType === this.facilityType) {
                switch (this.facilityType) {
                  case FacilityType.Hospital:
                    this.facilityTypeId = JSON.parse(
                      localStorage.getItem('facilityTypeId') as any
                    );
                    break;
                }
              }
            });
          });
      }
      if (this.professionalId?.length) {
        forkJoin({
          professional: this.api.getMedicalProfessional({
            professionalId: this.professionalId,
            professionalType: ProfessionalType.Doctor,
          }),
          professionalFee: this.api.getMedicalProfessionalFee({
            professionalId: this.professionalId,
          }),
        }).subscribe(({ professional, professionalFee }) => {
          const newProfessional: any = professional;
          const newprofessionalFee: any = professionalFee;
          this.form.patchValue({
            ...professional,
            specialization: newProfessional?.specializationName,
            phone: newProfessional.phone ?? newProfessional.phoneNumber,
            virtualConsultationFee:
              newprofessionalFee?.data[0]?.virtualConsultationFee,
            physicalConsultationFee:
              newprofessionalFee?.data[0]?.physicalConsultationFee,
            virtualHospitalFee: newprofessionalFee?.data[0]?.virtualHospitalFee,
            physicalHospitalFee:
              newprofessionalFee?.data[0]?.physicalHospitalFee,
          });
        });
      }
    });
  }

  goBack() {
    if (this.router.url.includes('doctor-dashboard')) {
      this.router.navigateByUrl(
        `/doctor-dashboard/${this.professionalId}/doctor-details`
      );
    } else {
      this.router.navigateByUrl(`/dashboard/doctors`);
    }
  }

  onNext(): void {
    this.loading = true;
    const professionalId = this.professionalId?.length
      ? this.professionalId
      : v4();

    this.navigateNext(professionalId);
  }

  navigateNext(professionalId: string): void {
    const selectedName: string = this.form.value.specialization;
    const specializationId: string | undefined = this.specializations.find(
      (item) =>
        item.text.toLocaleLowerCase() === selectedName.toLocaleLowerCase()
    )?.value;
    if (this.edit) {
      this.api
        .createMedicalProfessional({
          professionalId: this.professionalId,
          professionalType: ProfessionalType.Doctor,
          body: {
            ...this.form.value,
            email: this.form.value.email.toLowerCase(),
            specializationId: specializationId,
            issueDate: moment(this.form.value.issueDate).format('YYYY-MM-DD'),
            virtualConsultationFee: Number(
              this.form.value.virtualConsultationFee
            ),
            physicalConsultationFee: Number(
              this.form.value.physicalConsultationFee
            ),
          },
        })
        .subscribe({
          next: () => {
            if (this.router.url.includes('doctor-dashboard')) {
              this.router.navigateByUrl(
                `/doctor-dashboard/${this.professionalId}/doctor-details`
              );
            } else {
              this.router.navigateByUrl(
                `/dashboard/doctor-profile/${this.facilityType}/${this.facilityId}/${this.professionalId}`
              );
            }
          },
          error: () => {
            this.loading = false;
          },
        });
    } else {
      this.api
        .getAllUsers({
          email: this.form.value.email.toLowerCase(),
        })
        .subscribe({
          next: (response: any) => {
            if (response.data.length) {
              if (response.data[0].userType === ProfessionalType.Doctor) {
                this.api
                  .getMedicalProfessionals({
                    professionalType: ProfessionalType.Doctor,
                    email: this.form.value.email.toLowerCase(),
                  })
                  .subscribe({
                    next: (response: any) => {
                      this.api
                        .facilityConnectionRequest({
                          referencedDocumentId: response.data[0].professionalId,
                          body: {
                            connectionId: v4(),
                            facilityTypeId: this.facilityTypeId,
                            connectionType: 'Professional',
                            status: 'Pending',
                          },
                        })
                        .subscribe({
                          next: () => {
                            this.api
                              .createMedicalProfessionalFee({
                                professionalId: response.data[0].professionalId,
                                body: {
                                  feeId: this.form.value.feeId,
                                  facilityTypeId: this.facilityTypeId,
                                  virtualConsultation:
                                    this.form.value.virtualConsultation,
                                  virtualConsultationFee: Number(
                                    this.form.value.virtualConsultationFee
                                  ),
                                  physicalConsultationFee: Number(
                                    this.form.value.physicalConsultationFee
                                  ),
                                  virtualHospitalFee: Number(
                                    this.form.value.virtualHospitalFee
                                  ),
                                  physicalHospitalFee: Number(
                                    this.form.value.physicalHospitalFee
                                  ),
                                  virtualConsultationSettlement:
                                    this.form.value
                                      .virtualConsultationSettlement,
                                  physicalConsultationSettlement:
                                    this.form.value
                                      .physicalConsultationSettlement,
                                } as any,
                              })
                              .subscribe({
                                next: () => {
                                  this.router.navigateByUrl(
                                    `dashboard/doctor-profile/${this.facilityType}/${this.facilityId}/${response.data[0].professionalId}`
                                  );
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
                      this.loading = false;
                    },
                    error: () => {
                      this.loading = false;
                    },
                  });
              } else {
                this.toast.show(
                  'Email already exists for another user',
                  'error'
                );
              }
            } else {
              this.professionalId = professionalId;
              this.useAgain();
            }
            this.loading = false;
          },
          error: () => {
            this.loading = false;
          },
        });
    }
  }

  useAgain() {
    const selectedName: string = this.form.value.specialization;

    const specializationId: string | undefined = this.specializations.find(
      (item) =>
        item.text.toLocaleLowerCase() === selectedName.toLocaleLowerCase()
    )?.value;

    this.api
      .createMedicalProfessional({
        professionalId: this.professionalId,
        professionalType: ProfessionalType.Doctor,
        body: {
          ...this.form.value,
          email: this.form.value.email.toLowerCase(),
          specializationId: specializationId,
          issueDate: moment(this.form.value.issueDate).format('YYYY-MM-DD'),
          virtualConsultationFee: Number(
            this.form.value.virtualConsultationFee
          ),
          physicalConsultationFee: Number(
            this.form.value.physicalConsultationFee
          ),
        },
      })
      .subscribe({
        next: () => {
          this.loading = false;
          this.api
            .createMedicalProfessionalFee({
              professionalId: this.professionalId,
              body: {
                feeId: v4(),
                facilityTypeId: this.facilityTypeId,
                virtualConsultation: this.form.value.virtualConsultation,
                virtualConsultationFee: Number(
                  this.form.value.virtualConsultationFee
                ),
                physicalConsultationFee: Number(
                  this.form.value.physicalConsultationFee
                ),
                virtualHospitalFee: Number(this.form.value.virtualHospitalFee),
                physicalHospitalFee: Number(
                  this.form.value.physicalHospitalFee
                ),
                virtualConsultationSettlement:
                  this.form.value.virtualConsultationSettlement,
                physicalConsultationSettlement:
                  this.form.value.physicalConsultationSettlement,
              } as any,
            })
            .subscribe({
              next: () => {
                this.reuse();
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

  reuse() {
    const facilityType = JSON.parse(
      localStorage.getItem('facilityType') as any
    );
    this.facilityTypeId = JSON.parse(
      localStorage.getItem('facilityTypeId') as any
    );
    if (facilityType === this.facilityType) {
      this.loading = false;
      switch (this.facilityType) {
        case FacilityType.Hospital:
          this.api
            .connectProfessionalToFacilityType({
              facilityTypeId: this.facilityTypeId,
              professionalId: this.professionalId,
              body: {
                connectionId: v4(),
              },
            })
            .subscribe({
              next: () => {
                this.step++;
                this.loading = false;
                this.router.navigateByUrl(
                  `dashboard/add-doctor-license/${this.facilityType}/${this.facilityId}/${this.professionalId}/${this.step}/new`
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

  isCadreClicked() {
    this.isCadre = true;
    this.isSpecialization = false;
  }

  isSpecializedClicked() {
    this.isSpecialization = true;
    this.isCadre = false;
    this.isVirtualSettlement = false;
    this.isPhysicalSettlement = false;
  }

  offCadreClicked() {
    this.isCadre = false;
  }

  offSpecializedClicked() {
    this.isSpecialization = false;
  }

  isVirtualSettlementClicked() {
    this.isVirtualSettlement = true;
    this.isSpecialization = false;
    this.isCadre = false;
    this.isPhysicalSettlement = false;
  }

  offVirtualSettlementClicked() {
    this.isVirtualSettlement = false;
  }

  isPhysicalSettlementClicked() {
    this.isPhysicalSettlement = true;
    this.isSpecialization = false;
    this.isCadre = false;
    this.isVirtualSettlement = false;
  }

  offPhysicalSettlementClicked() {
    this.isPhysicalSettlement = false;
  }
}
