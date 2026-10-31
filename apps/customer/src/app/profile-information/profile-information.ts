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
import { ApiService, BloodGroup, Gender, Relationship } from '@care-way/api';
import {
  AuthService,
  ConversionService,
  ProfileInfoService,
} from '@care-way/shared';
import {
  ButtonComponent,
  InputCalendar,
  InputComponent,
  Item,
  StorageService,
  ToastService,
} from '@care-way/ui';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import moment from 'moment';
import { map } from 'rxjs';

@Component({
  selector: 'app-profile-information',
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
  templateUrl: './profile-information.html',
  styleUrl: './profile-information.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProfileInformation implements OnInit {
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);
  private storageService = inject(StorageService);
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
  gender = new FormControl('', Validators.required);
  bloodGroup = new FormControl('');
  relationship = new FormControl('', Validators.required);
  genders: any = [];
  memberId: any;
  isBlood = false;
  isRelationship = false;
  isVitals = false;
  module: string | null;
  loading: boolean;
  bloodGroups: Item[] = [];

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      this.module = params.module;
    });
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
    this.conversionService.convert(Gender, this.genders);
    this.conversionService.convert(BloodGroup, this.bloodGroups);

    this.auth.userDetail(this.api, (auth) => {
      this.form.patchValue({ referencedDocumentId: auth?.jti });
      this.api
        .getMembers({
          referencedDocumentId: auth?.jti,
        })
        .subscribe((response: any) => {
          const member =
            response.data.find(
              (res: any) => res.relationship === Relationship.Self
            ) ?? response.data[0];
          this.getProfilePicture(member.memberId).subscribe((url: any) => {
            this.profileInfoService.loggedInPicture = url;
          });
          this.memberId = member.memberId;
          this.form.patchValue({
            ...member,
            dob:
              member.dob && moment(member.dob).isValid()
                ? moment(member.dob).format('YYYY-MM-DD')
                : '',
          });
        });
    });
    this.isVitals = this.router.url.includes('BP');
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
        email: this.form.value.email.toLowerCase(),
        memberId: this.memberId,
      },
    };

    this.api.createMember(payload).subscribe(() => {
      Object.keys(this.form.controls).forEach((key) => {
        this.form.get(key)?.setValue('');
      });
      this.loading = false;
      this.toastr.show('Account info updated successfully', 'success');
      this.storageService.refresh();

      const url = this.router.url;

      switch (true) {
        case url.includes('BP'):
          this.router.navigate([
            'dashboard/vitals/blood-pressure-record',
            this.module,
          ]);
          break;

        case url.includes('Temp'):
          this.router.navigate([
            'dashboard/vitals/temperature-record',
            this.module,
          ]);
          break;

        case url.includes('Weight'):
          this.router.navigate(['dashboard/vitals/weight-record', this.module]);
          break;

        case url.includes('Height'):
          this.router.navigate(['dashboard/vitals/height-record', this.module]);
          break;

        case url.includes('OS'):
          this.router.navigate([
            'dashboard/vitals/oxygen-saturation-record',
            this.module,
          ]);
          break;

        default:
          this.router.navigateByUrl('/dashboard/profile');
      }
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

  deletePhoto() {
    // dele
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
