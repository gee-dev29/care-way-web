import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  FormControl,
  Validators,
  FormGroup,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { chevronBackOutline } from 'ionicons/icons';
import { v4 } from 'uuid';
import { ButtonComponent } from '../button/button.component';
import { InputComponent } from '../input/input';
import { addIcons } from 'ionicons';
import { IonIcon, IonText } from '@ionic/angular/standalone';

@Component({
  selector: 'ui-add-new-member',
  imports: [
    IonIcon,
    InputComponent,
    ButtonComponent,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonText,
  ],

  templateUrl: './add-new-member.html',
  styleUrl: './add-new-member.css',
})
export class AddNewMember implements OnInit {
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  @Input() heading: string;
  @Input() label: string;
  @Input() facilityType: string;
  @Input() FacilityType: any;
  @Input() professionalType: any;
  @Input() api: any;
  @Input() route: string;
  @Input() genders: any = [];
  @Input() backRoute: string;
  firstName = new FormControl('', [Validators.required]);
  lastName = new FormControl('', [Validators.required]);
  gender = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required, Validators.email]);
  phone = new FormControl('', [
    Validators.required,
    Validators.pattern(/^[0-9]{11}$/),
  ]);
  form: FormGroup;
  loading = false;
  private activatedRoute = inject(ActivatedRoute);
  professionalId: string;
  edit = false;
  facilityId: string;
  constructor() {
    addIcons({
      chevronBackOutline,
    });
  }

  ngOnInit() {
    this.form = this.formBuilder.group({});
    this.form.setControl('firstName', this.firstName);
    this.form.setControl('lastName', this.lastName);
    this.form.setControl('gender', this.gender);
    this.form.setControl('email', this.email);
    this.form.setControl('phone', this.phone);
    this.activatedRoute.params.subscribe((params: any) => {
      this.professionalId = params.professionalId;
      this.facilityId = params.facilityId;
      if (this.professionalId?.length) {
        this.edit = true;
        this.api
          .getMedicalProfessional({
            professionalId: this.professionalId,
            professionalType: this.professionalType,
          })
          .subscribe((response: any) => {
            this.form.patchValue({
              ...response,
              phone: response.phone ?? response.phoneNumber,
            });
          });
      }
    });
  }

  goBack() {
    this.router.navigateByUrl(this.backRoute);
  }

  proceed(): void {
    this.loading = true;
    if (this.edit) {
      this.useAgain();
    } else {
      this.api
        .getMedicalProfessionals({
          professionalType: this.professionalType,
          email: this.form.value.email.toLowerCase(),
        })
        .subscribe({
          next: (response: any) => {
            if (response.data.length) {
              this.professionalId = response.data[0].professionalId;
              this.reuse();
            } else {
              this.professionalId = v4();
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
    this.api
      .createMedicalProfessional({
        professionalId: this.professionalId,
        professionalType: this.professionalType,
        body: {
          ...this.form.value,
          email: this.form.value.email.toLowerCase(),
        },
      })
      .subscribe(() => {
        this.reuse();
      });
  }

  reuse() {
    const facilityType = JSON.parse(
      localStorage.getItem('facilityType') as any
    );
    const facilityTypeId = JSON.parse(
      localStorage.getItem('facilityTypeId') as any
    );
    switch (facilityType) {
      case this.FacilityType.Pharmacy:
        if (this.edit) {
          this.router.navigateByUrl(
            `/dashboard/pharmacist-profile/${this.facilityType}/${this.facilityId}/${this.professionalId}`
          );
        } else {
          this.api
            .connectProfessionalToFacilityType({
              facilityTypeId: facilityTypeId,
              professionalId: this.professionalId,
              body: {
                connectionId: v4(),
              },
            })
            .subscribe(() => {
              this.router.navigateByUrl(
                `/dashboard/pharmacist-license-details/${this.facilityType}/${this.facilityId}/${this.professionalId}`
              );
            });
        }
        break;
      case this.FacilityType.Laboratory:
        if (this.edit) {
          this.router.navigateByUrl(
            `/dashboard/scientist-profile/${this.facilityType}/${this.facilityId}/${this.professionalId}`
          );
        } else {
          this.api
            .connectProfessionalToFacilityType({
              facilityTypeId: facilityTypeId,
              professionalId: this.professionalId,
              body: {
                connectionId: v4(),
              },
            })
            .subscribe(() => {
              this.router.navigateByUrl(
                `dashboard/scientist-license-details/${this.facilityType}/${this.facilityId}/${this.professionalId}`
              );
            });
        }
        break;
      case this.FacilityType.BloodBank:
        if (this.edit) {
          this.router.navigateByUrl(
            `/dashboard/lab-technician-profile/${this.facilityType}/${this.facilityId}/${this.professionalId}`
          );
        } else {
          this.api
            .connectProfessionalToFacilityType({
              facilityTypeId: facilityTypeId,
              professionalId: this.professionalId,
              body: {
                connectionId: v4(),
              },
            })
            .subscribe(() => {
              this.router.navigateByUrl(
                `/dashboard/lab-technician-profile/${this.facilityType}/${this.facilityId}/${this.professionalId}`
              );
            });
        }
        break;
      case this.FacilityType.Radiology:
        if (this.edit) {
          this.router.navigateByUrl(
            `/dashboard/radiologist-profile/${this.facilityType}/${this.facilityId}/${this.professionalId}`
          );
        } else {
          this.api
            .connectProfessionalToFacilityType({
              facilityTypeId: facilityTypeId,
              professionalId: this.professionalId,
              body: {
                connectionId: v4(),
              },
            })
            .subscribe(() => {
              this.router.navigateByUrl(
                `/dashboard/radiologist-profile/${this.facilityType}/${this.facilityId}/${this.professionalId}`
              );
            });
        }
        break;
    }
    Object.keys(this.form.controls).forEach((key) => {
      this.form.get(key)?.setValue('');
    });
  }
}
