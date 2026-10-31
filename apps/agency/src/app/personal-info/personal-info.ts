import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, Gender } from '@healbridge/api';
import {
  AuthService,
  ConversionService,
  ProfileInfoService,
  ToastService,
} from '@healbridge/shared';
import { ButtonComponent, InputCalendar, InputComponent } from '@healbridge/ui';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { map } from 'rxjs';

@Component({
  selector: 'agency-personal-info',
  imports: [
    InputComponent,
    IonIcon,
    IonHeader,
    IonText,
    IonContent,
    InputCalendar,
    ReactiveFormsModule,
    FormsModule,
    ButtonComponent,
  ],
  templateUrl: './personal-info.html',
  styleUrl: './personal-info.css',
})
export class PersonalInfo {
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private api = inject(ApiService);
  public toastr = inject(ToastService);
  public auth = inject(AuthService);
  public conversionService = inject(ConversionService);
  public profileInfoService = inject(ProfileInfoService);
  form: FormGroup;
  firstName = new FormControl('', Validators.required);
  referencedDocumentId = new FormControl('', Validators.required);
  isPatched = false;
  lastName = new FormControl('', Validators.required);
  dob = new FormControl('', Validators.required);
  email = new FormControl('', [Validators.required, Validators.email]);
  phone = new FormControl('', Validators.required);
  memberId: any;
  gender = new FormControl('', Validators.required);
  genders: any = [];
  relationship = new FormControl('', Validators.required);
  loading: boolean;

  ngOnInit(): void {
    this.conversionService.convert(Gender, this.genders);

    this.form = this.formBuilder.group({
      firstName: this.firstName,
      referencedDocumentId: this.referencedDocumentId,
      lastName: this.lastName,
      dob: this.dob,
      email: this.email,
      gender: this.gender,
      relationship: this.relationship,
      phone: this.phone,
      memberId: this.memberId,
    });
    this.auth.userDetail(this.api, (auth) => {
      this.form.patchValue({ referencedDocumentId: auth?.jti });
    });

    this.api
      .getMembers({
        referencedDocumentId: this.form.value.referencedDocumentId,
      })
      .subscribe((response: any) => {
        this.getProfilePicture(response.data[0].memberId).subscribe(
          (url: any) => {
            this.profileInfoService.picture = url;
          }
        );
        this.memberId = response.data[0].memberId;
        this.form.patchValue(response.data[0]);
      });
  }

  constructor() {
    addIcons({
      chevronBackOutline,
    });
  }

  cancel() {
    this.router.navigateByUrl('/dashboard/profile');
  }

  save() {
    this.loading = true;
    const payload = {
      referencedDocumentId: this.form.value.referencedDocumentId,
      body: {
        ...this.form.value,
        memberId: this.memberId,
      },
    };

    this.api.createMember(payload).subscribe({
      next: () => {
        this.loading = false;
        Object.keys(this.form.controls).forEach((key) => {
          this.form.get(key)?.setValue('');
        });
        this.toastr.show('Account info updated successfully', 'success');
        this.router.navigateByUrl('/dashboard/more');
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  getProfilePicture(referencedDocumentId: string) {
    return this.api
      .getUploads({ referencedDocumentId })
      .pipe(
        map((response: any[]) =>
          response?.length ? response[response.length - 1].url : null
        )
      );
  }
}
