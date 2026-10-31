import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, NonProfessionalUserType } from '@healbridge/api';
import {
  AuthService,
  BloodGroup,
  ConversionService,
  Gender,
  Relationship,
  ToastService,
} from '@healbridge/shared';
import {
  ButtonComponent,
  InputCalendar,
  InputComponent,
  Item,
  LimitSize,
} from '@healbridge/ui';
import { IonContent, IonIcon, IonText } from '@ionic/angular/standalone';
import { concatMap, map, of, switchMap } from 'rxjs';
import { v4 } from 'uuid';

@Component({
  selector: 'medical-facility-add-patient',
  imports: [
    IonContent,
    CommonModule,
    IonIcon,
    IonText,
    ButtonComponent,
    InputComponent,
    InputCalendar,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './add-patient.html',
  styleUrl: './add-patient.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AddPatient implements OnInit {
  genders: any = [];
  isBlood = false;
  isRelationship = false;
  bloodGroups: Item[] = [];
  loading = false;
  label = 'Next';
  facilityTypeId: string;
  facilityType: string;
  facilityId: string;
  form: FormGroup;
  relationships: Item[] = [];
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(AuthService);
  private toastr = inject(ToastService);
  private conversion = inject(ConversionService);
  private activatedRoute = inject(ActivatedRoute);
  private api = inject(ApiService);
  firstName = new FormControl('', Validators.required);
  referencedDocumentId = new FormControl('', Validators.required);
  isPatched = false;
  lastName = new FormControl('', Validators.required);
  dob = new FormControl('', Validators.required);
  email = new FormControl('', [Validators.required, Validators.email]);
  phone = new FormControl('', Validators.required);
  gender = new FormControl('', Validators.required);
  bloodGroup = new FormControl('', Validators.required);
  doesUserExist = false;

  ionViewWillEnter() {
    this.setReferencedDocumentId();
  }
  ngOnInit(): void {
    this.conversion.convert(BloodGroup, this.bloodGroups);
    this.conversion.convert(Relationship, this.relationships);
    this.conversion.convert(Gender, this.genders);
    this.form = this.formBuilder.group({
      firstName: this.firstName,
      referencedDocumentId: this.referencedDocumentId,
      lastName: this.lastName,
      dob: this.dob,
      email: this.email,
      phone: this.phone,
      gender: this.gender,
      bloodGroup: this.bloodGroup,
    });
    this.setReferencedDocumentId();
    this.activatedRoute.params.subscribe((params: any) => {
      this.facilityId = params.facilityId;
      this.facilityType = params.facilityType;
      this.facilityTypeId = params.facilityTypeId;
      if (params.patientId) {
        this.api
          .getMember({ memberId: params.patientId })
          .subscribe((response: any) => {
            this.isPatched = true;
            this.form.patchValue(response);
          });
      }
    });
  }
  setReferencedDocumentId() {
    this.auth.userDetail(this.api, (auth) => {
      this.form.patchValue({ referencedDocumentId: auth?.jti as any });
    });
  }

  goBack() {
    this.router.navigate(['/dashboard/patients']);
  }

  next() {
    this.loading = true;
    this.label = 'Please Wait';
    this.api.getAllUsers({ email: this.form.value.email }).subscribe({
      next: (response: any) => {
        if (response.data.length) {
          if (response.data[0].userType != 'Default') {
            this.loading = false;
            this.toastr.show(
              `Please use another email as this email has already been used for ${response.data[0].userType} account`,
              'error'
            );
          } else {
            this.loading = true;
            const email = this.form.value.email;
            this.api
              .getMembers({ skip: 0, limit: LimitSize.DropDown })
              .pipe(
                map((response: any) =>
                  response.data.find((each: any) => each.email === email)
                ),
                switchMap((existingMember: any) => {
                  const memberId = existingMember.memberId;
                  return this.api
                    .facilityConnectionRequest({
                      referencedDocumentId: memberId,
                      body: {
                        connectionId: v4(),
                        facilityTypeId: this.facilityTypeId,
                        connectionType: 'Member',
                        status: 'Pending',
                      },
                    })
                    .pipe(map(() => ({ memberId, type: 'EXISTING' })));
                })
              )
              .subscribe({
                next: (result) => {
                  this.loading = false;
                  const { memberId, type } = result;
                  if (type === 'EXISTING') {
                    this.router.navigate([
                      '/dashboard/patient-profile',
                      this.facilityType,
                      this.facilityId,
                      this.facilityTypeId,
                      memberId,
                    ]);
                  } else {
                    const msg = this.isPatched
                      ? 'Patient updated successfully'
                      : 'Patient created successfully';
                    this.toastr.show(msg, 'success');
                    this.router.navigate([
                      '/dashboard/patient-upload',
                      this.facilityType,
                      this.facilityId,
                      this.facilityTypeId,
                      memberId,
                    ]);
                  }

                  Object.keys(this.form.controls).forEach((key) => {
                    this.form.get(key)?.setValue('');
                  });
                },
                error: () => {
                  this.loading = false;
                },
              });
          }
        } else {
          const email = this.form.value.email.toLowerCase();
          const connectionId = v4();
          const userId = v4();
          this.api
            .signUpUser({
              body: {
                ...this.form.value,
                email:email,
                userType: NonProfessionalUserType.Default,
                userTypeId: userId,
                userId: userId,
                agentId: null,
              },
            })
            .pipe(
              concatMap(() =>
                this.api.getMembers({ skip: 0, limit: LimitSize.DropDown })
              ),
              map((response: any) =>
                response.data.find((m: any) => m.email === email)
              ),
              switchMap((member: any) => {
                if (!member) throw new Error('Member not found after signup');
                this.form.patchValue({ memberId: member.memberId });
                return this.api
                  .facilityConnectionRequest({
                    referencedDocumentId: member.memberId,
                    body: {
                      connectionId: connectionId,
                      facilityTypeId: this.facilityTypeId,
                      connectionType: 'Member',
                      status: 'Approved',
                    },
                  })
                  .pipe(
                    switchMap(() =>
                      this.api.connectMemberToFacilityType({
                        facilityTypeId: this.facilityTypeId,
                        memberId: member.memberId,
                        body: { connectionId },
                      })
                    ),
                    map(() => member.memberId)
                  );
              })
            )
            .subscribe({
              next: (memberId) => {
                this.loading = false;
                Object.keys(this.form.controls).forEach((key) => {
                  this.form.get(key)?.setValue('');
                });
                this.router.navigate([
                  '/dashboard/patient-profile',
                  this.facilityType,
                  this.facilityId,
                  this.facilityTypeId,
                  memberId,
                ]);
              },
              error: (err) => {
                this.loading = false;
              },
            });
        }
      },
      error: (err: any) => {
        this.loading = false;
      },
    });
  }

  isRelationshipClicked() {
    this.isRelationship = true;
    this.isBlood = false;
  }

  isBloodClicked() {
    this.isBlood = true;
    this.isRelationship = false;
  }

  offRelationshipClicked() {
    this.isRelationship = false;
  }

  offBloodClicked() {
    this.isBlood = false;
  }

  getEmail(event: any) {
    const emailRegex =
      /^(?!.*\.\.)(?!.*\.$)[A-Za-z0-9]+([._%+-]?[A-Za-z0-9]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
    const email = event.trim();

    if (!emailRegex.test(email)) return;

    this.checkEmail(email);
  }

  checkEmail(email: string) {
    this.api.getAllUsers({ email }).subscribe({
      next: (res: any) => {
        this.doesUserExist = res?.data?.length > 0;

        if (this.doesUserExist) {
          if (!this.form.contains('dob')) {
            this.form.addControl('dob', this.dob);
          }

          if (!this.form.contains('bloodGroup')) {
            this.form.addControl('bloodGroup', this.bloodGroup);
          }
        } else {
          this.form.removeControl('dob');
          this.form.removeControl('bloodGroup');
        }
      },
    });
  }
}
