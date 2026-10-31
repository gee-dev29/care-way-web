import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { IonText } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { v4 } from 'uuid';
import moment from 'moment';
import { InputCalendar } from '../input-calendar/input-calendar';
import { ButtonComponent } from '../button/button.component';
import { InputComponent } from '../input/input';
import { ToastService } from '../toast';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';

@Component({
  selector: 'ui-shared-license',
  imports: [
    ButtonComponent,
    IonText,
    CommonModule,
    InputComponent,
    ReactiveFormsModule,
    InputCalendar,
  ],
  templateUrl: './shared-license.html',
  styleUrl: './shared-license.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedLicense implements OnInit {
  @Input() api: any;
  @Input() facilityType: any;
  @Input() route: any;
  @Output() routeBack = new EventEmitter<any>();
  private router = inject(Router);
  private toast = inject(ToastService);
  private activatedRoute = inject(ActivatedRoute);
  facilityId: string;
  pharmacyId: string;
  loading = false;
  label = 'Continue';
  form: FormGroup;
  max: any = '2025-01-01';
  didFacilityMissOnboarding = false;
  today: any = moment().format('YYYY-MM-DD');
  edit = '';
  formBuilder = inject(FormBuilder);
  licenseId = new FormControl(v4(), Validators.required);
  licenseNumber = new FormControl('', Validators.required);
  issueDate = new FormControl('', Validators.required);
  expiryDate = new FormControl('', Validators.required);
  referencedDocumentId = new FormControl('', Validators.required);
  licenseType = new FormControl('', Validators.required);

  constructor() {
    addIcons({
      chevronBackOutline,
    });
  }
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      licenseId: this.licenseId,
      licenseNumber: this.licenseNumber,
      issueDate: this.issueDate,
      expiryDate: this.expiryDate,
      referencedDocumentId: this.referencedDocumentId,
      licenseType: this.licenseType,
    });
    this.activatedRoute.params.subscribe((params: any) => {
      this.facilityId = params.facilityId;
      this.pharmacyId =
        params.pharmacyId ??
        params.professionalId ??
        params.laboratoryId ??
        params.bloodBankId;
      this.edit = params.edit;
      if (this.pharmacyId && params.licenseId) {
        this.api
          .getPracticeLicenses({ referencedDocumentId: this.pharmacyId })
          .subscribe((license: any) => {
            const newLicense = license.find(
              (data: any) => data.licenseId === params.licenseId
            );
            this.form.patchValue({
              licenseId: newLicense.licenseId,
              licenseNumber: newLicense.licenseNumber,
              issueDate: newLicense.issueDate,
              expiryDate: newLicense.expiryDate,
              referencedDocumentId: newLicense.referencedDocumentId,
            });
          });
      }
      this.form.patchValue({
        referencedDocumentId: this.pharmacyId,
        licenseType: this.facilityType,
      });
    });
    this.activatedRoute.queryParams.subscribe((params: any) => {
      if (params.error) {
        this.didFacilityMissOnboarding = true;
      }
    });
  }

  calculateDate() {
    this.max = moment(this.form.value.issueDate)
      .add(1, 'years')
      .format('YYYY-MM-DD');
  }

  proceed() {
    this.loading = true;
    this.label = 'Please Wait';
    this.api
      .addPracticeLicense({
        referencedDocumentId: this.pharmacyId,
        body: this.form.value,
      } as any)
      .subscribe({
        next: () => {
          Object.keys(this.form.controls).forEach((key) => {
            this.form.get(key)?.setValue('');
          });
          if (this.edit?.length) {
            this.toast.show(
              `${this.facilityType} License updated successfully`,
              'success'
            );
            this.router.navigateByUrl(this.route);
          } else {
            this.toast.show('Practice License added successfully', 'success');
            if (this.didFacilityMissOnboarding) {
              this.router.navigateByUrl(`${this.route}?error=true`);
            } else {
              this.router.navigateByUrl(this.route);
            }
          }
        },
        error: (err: any) => {
          this.loading = false;
        },
        complete: () => {
          this.label = 'Continue';
          this.loading = false;
        },
      });
  }
  goBack() {
    this.routeBack.emit();
  }
}
