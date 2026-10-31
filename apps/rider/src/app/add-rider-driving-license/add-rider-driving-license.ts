import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@healbridge/api';
import { ConversionService, Module, ToastService } from '@healbridge/shared';
import { ButtonComponent, InputCalendar, InputComponent } from '@healbridge/ui';
import { IonContent, IonText } from '@ionic/angular/standalone';
import moment from 'moment';
import { v4 } from 'uuid';

@Component({
  selector: 'rider-add-rider-driving-license',
  imports: [
    ButtonComponent,
    IonText,
    CommonModule,
    InputComponent,
    ReactiveFormsModule,
    InputCalendar,
    IonContent,
  ],
  templateUrl: './add-rider-driving-license.html',
  styleUrl: './add-rider-driving-license.css',
})
export class AddRiderDrivingLicense implements OnInit {
  public api = inject(ApiService);
  private conversion = inject(ConversionService);
  private activatedRoute = inject(ActivatedRoute);
  private toast = inject(ToastService);
  private router = inject(Router);
  riderId: any;
  label = 'Continue';
  form: FormGroup;
  loading = false;
  max: any = '2025-01-01';
  isClass = false;
  formBuilder = inject(FormBuilder);
  licenseId = new FormControl(v4(), Validators.required);
  licenseNumber = new FormControl('', Validators.required);
  issueDate = new FormControl('', Validators.required);
  expiryDate = new FormControl('', Validators.required);
  licenseType = new FormControl(Module.RIDER, Validators.required);
  edit = false;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.riderId = params.riderId;
      if (params.edit) {
        this.edit = true;
        this.api
          .getPracticeLicenses({ referencedDocumentId: this.riderId })
          .subscribe((res: any) => {
            if (res.length > 0) {
              const license = res[0];
              this.licenseId.setValue(license.licenseId);
              this.licenseNumber.setValue(license.licenseNumber);
              this.issueDate.setValue(
                moment(license.issueDate).format('YYYY-MM-DD')
              );
              this.expiryDate.setValue(
                moment(license.expiryDate).format('YYYY-MM-DD')
              );
            }
          });
      }
    });
    this.form = this.formBuilder.group({
      licenseId: this.licenseId,
      licenseNumber: this.licenseNumber,
      issueDate: this.issueDate,
      expiryDate: this.expiryDate,
      licenseType: this.licenseType,
    });
  }

  isClassClicked() {
    this.isClass = true;
  }

  offClassClicked() {
    this.isClass = false;
  }
  calculateDate() {
    this.max = moment(this.form.value.issueDate)
      .add(4, 'years')
      .format('YYYY-MM-DD');
  }
  proceed() {
    this.loading = true;
    this.label = 'Please Wait';
    this.api
      .addPracticeLicense({
        referencedDocumentId: this.riderId,
        body: this.form.value,
      } as any)
      .subscribe({
        next: () => {
          Object.keys(this.form.controls).forEach((key) => {
            this.form.get(key)?.setValue('');
          });

          if (this.edit) {
            this.toast.show(
              'Rider License details updated successfully',
              'success'
            );
            this.router.navigate([
              '/dashboard/upload-rider-license',
              this.riderId,
              'edit',
            ]);
          } else {
            this.toast.show('Rider License added successfully', 'success');
            this.router.navigate([
              '/dashboard/upload-rider-license',
              this.riderId,
            ]);
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
}
