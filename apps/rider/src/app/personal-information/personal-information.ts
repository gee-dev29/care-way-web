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
import { ApiService } from '@care-way/api';
import { ButtonComponent, InputComponent, ToastService } from '@care-way/ui';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-personal-information',
  imports: [
    IonHeader,
    IonContent,
    IonIcon,
    IonText,
    InputComponent,
    ButtonComponent,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './personal-information.html',
  styleUrl: './personal-information.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PersonalInformation implements OnInit {
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);
  private toastr = inject(ToastService);

  form: FormGroup;

  firstName = new FormControl('', Validators.required);
  lastName = new FormControl('', Validators.required);
  email = new FormControl('', [Validators.required, Validators.email]);
  phone = new FormControl('', Validators.required);

  riderId = '';
  memberId = '';
  loading = false;

  constructor() {
    addIcons({ chevronBackOutline });
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
    });

    this.riderId = this.route.snapshot.params['riderId'];

    if (this.riderId) {
      this.getRiderDetails();
    }
  }

  getRiderDetails() {
    this.api
      .getMembers({
        referencedDocumentId: this.riderId,
      })
      .subscribe((response: any) => {
        const rider = response?.data?.[0];

        if (!rider) return;

        this.memberId = rider.memberId;

        this.form.patchValue({
          firstName: rider.firstName,
          lastName: rider.lastName,
          email: rider.email,
          phone: rider.phone,
        });
      });
  }

  save() {
    if (this.form.invalid) return;

    this.loading = true;

    this.api
      .signUpUser({
        body: {
          ...this.form.value,
          email: this.form.value.email.toLowerCase(),
          userTypeId: this.riderId,
        },
      })

      .subscribe({
        next: () => {
          this.loading = false;
          this.toastr.show('Rider profile updated successfully', 'success');
          this.router.navigateByUrl('/dashboard/profile/' + this.riderId);
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  cancel() {
    this.router.navigateByUrl('/dashboard/profile/' + this.riderId);
  }
}
