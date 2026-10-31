import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
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
import { FacilityType } from '@care-way/shared';
import {
  DesktopButton,
  ToastService,
  DesktopInput,
  DateInput,
} from '@care-way/ui';
import moment from 'moment';
import { v4 } from 'uuid';

@Component({
  selector: 'back-office-desktop-license',
  imports: [
    CommonModule,
    FormsModule,
    DesktopButton,
    ReactiveFormsModule,
    DesktopInput,
    DateInput,
  ],
  templateUrl: './desktop-license.html',
  styleUrl: './desktop-license.css',
})
export class DesktopLicense implements OnInit {
  @Input() api: any;
  @Input() facilityType: any;
  @Input() route: any;
  private router = inject(Router);
  private toast = inject(ToastService);
  private activatedRoute = inject(ActivatedRoute);
  facilityId: string;
  pharmacyId: string;
  @Input() hospitalId: string;
  loading = false;
  label = 'Continue';
  form: FormGroup;
  max: any = '2025-01-01';
  edit = '';
  formBuilder = inject(FormBuilder);
  licenseId = new FormControl(v4(), Validators.required);
  licenseNumber = new FormControl(new Date(), Validators.required);
  issueDate = new FormControl('', Validators.required);
  expiryDate = new FormControl('', Validators.required);
  referencedDocumentId = new FormControl('', Validators.required);
  licenseType = new FormControl('', Validators.required);
  @Output() saved = new EventEmitter<{ id: string; type: string }>();
  @Output() cancelled = new EventEmitter<void>();

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
      this.hospitalId =
        params.hospitalId ??
        params.professionalId ??
        params.laboratoryId ??
        params.bloodBankId;
      this.form.patchValue({
        referencedDocumentId: this.facilityId,
        licenseType: this.facilityType,
      });
      if (this.licenseId) {
        this.api.getPracticeLicense({
          referencedDocumentId: this.facilityId,
        });
      }
    });
  }
  calculateDate() {
    this.max = moment(this.form.value.issueDate)
      .add(10, 'years')
      .format('YYYY-MM-DD');
  }

  proceed() {
    this.loading = true;
    this.label = 'Please Wait';
    const payload = {
      ...this.form.value,
      issueDate: moment(this.form.value.issueDate).format('YYYY-MM-DD'),
      expiryDate: moment(this.form.value.expiryDate).format('YYYY-MM-DD'),
    };
    this.api
      .addPracticeLicense({
        referencedDocumentId: this.form.value.referencedDocumentId,
        body: payload,
      } as any)
      .subscribe({
        next: () => {
          if (this.edit?.length) {
            this.toast.show(
              `${this.facilityType} License updated successfully`,
              'success'
            );
            // this.router.navigateByUrl(this.route);
          } else {
            this.toast.show('Practice License added successfully', 'success');
            // this.router.navigateByUrl(this.route);
          }
          this.saved.emit({ id: this.hospitalId, type: this.facilityType });
          this.form.reset();
        },
        error: (err: any) => {
          this.toast.show('Something went wrong', 'error');
        },
        complete: () => {
          this.label = 'Continue';
          this.loading = false;
        },
      });
  }
  cancel() {
    this.cancelled.emit();
  }
}
