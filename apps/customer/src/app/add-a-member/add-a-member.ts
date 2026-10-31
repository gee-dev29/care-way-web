import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  inject,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, BloodGroup, Gender } from '@care-way/api';
import {
  AuthService,
  ConversionService,
  Relationship,
} from '@care-way/shared';
import {
  ButtonComponent,
  InputCalendar,
  InputComponent,
  Item,
  ToastService,
} from '@care-way/ui';

import { IonContent, IonIcon, IonText } from '@ionic/angular/standalone';
import { v4 } from 'uuid';

@Component({
  selector: 'app-add-a-member',
  imports: [
    IonContent,
    IonIcon,
    IonText,
    CommonModule,
    InputComponent,
    InputCalendar,
    ButtonComponent,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './add-a-member.html',
  styleUrl: './add-a-member.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AddAMember implements OnInit {
  genders: any = [];
  isBlood = false;
  isRelationship = false;
  loading = false;
  memberLabel = 'Next';
  form: FormGroup;
  relationships: Item[] = [];
  bloodGroups: Item[] = [];
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(AuthService);
  private toastr = inject(ToastService);
  private conversion = inject(ConversionService);
  private activatedRoute = inject(ActivatedRoute);
  private api = inject(ApiService);
  memberId = new FormControl(v4(), Validators.required);
  firstName = new FormControl('', Validators.required);
  referencedDocumentId = new FormControl('', Validators.required);
  isPatched = false;
  lastName = new FormControl('', Validators.required);
  dob = new FormControl('', Validators.required);
  email = new FormControl('', [Validators.required, Validators.email]);
  phone = new FormControl('', Validators.required);
  gender = new FormControl('', Validators.required);
  bloodGroup = new FormControl('', Validators.required);
  relationship = new FormControl('', Validators.required);

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
      relationship: this.relationship,
      memberId: this.memberId,
    });
    this.auth.userDetail(this.api, (auth) => {
      this.form.patchValue({ referencedDocumentId: auth?.jti });
    });
    this.activatedRoute.params.subscribe((params: any) => {
      if (params.memberId) {
        this.api
          .getMember({ memberId: params.memberId })
          .subscribe((response: any) => {
            this.isPatched = true;
            this.form.patchValue(response);
          });
      }
    });
  }

  @Output() back = new EventEmitter();

  goBack() {
    this.router.navigateByUrl('dashboard/home');
  }

  next() {
    this.loading = true;
    this.memberLabel = 'Please Wait';
    const memberId = this.form.value.memberId;
    this.auth.userDetail(this.api, (auth) => {
      this.api
        .createMember({
          referencedDocumentId: auth?.jti as any,
          body: {
            ...this.form.value,
            email:this.form.value.email.toLowerCase(),
            relationship: this.form.value.relationship,
            bloodGroup: this.form.value.bloodGroup,
          },
        })
        .subscribe({
          next: () => {
            if (this.isPatched) {
              this.toastr.show('Member updated successfully', 'success');
            } else {
              this.toastr.show('Member created successfully', 'success');
            }
            this.memberLabel = 'Next';
            this.loading = false;
            Object.keys(this.form.controls).forEach((key) => {
              this.form.get(key)?.setValue('');
            });
            this.router.navigate([
              '/dashboard/upload-member-picture',
              memberId,
            ]);
          },
          error: () => {
            this.memberLabel = 'Next';
            this.loading = false;
          },
        });
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
}
