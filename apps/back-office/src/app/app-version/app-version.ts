import { Component, inject, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiService } from '@care-way/api';
import { IonModal } from '@ionic/angular/common';
import { addIcons } from 'ionicons';
import { close } from 'ionicons/icons';
import { ToastrService } from 'ngx-toastr';
import { map, Observable, tap } from 'rxjs';
import { v4 } from 'uuid';
import { PageBody, DesktopButton, Modal, DesktopInput, InputDropDownComponent } from '@care-way/ui';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { AppNames, ConversionService } from '@care-way/shared';

@Component({
  selector: 'back-office-app-version',
  imports: [
    PageBody,
    DesktopButton,
    TableModule,
    Modal,
    DesktopInput,
    ReactiveFormsModule,
    CommonModule,
    InputDropDownComponent
],
  templateUrl: './app-version.html',
  styleUrl: './app-version.css',
})
export class AppVersion implements OnInit {
  api = inject(ApiService);
  formBuilder = inject(FormBuilder);
  toastr = inject(ToastrService);
  conversionService = inject(ConversionService);
  @ViewChild(IonModal) modal!: IonModal;
  loading = false;
  totalRecords = 0;
  addModal = false;
  editVersion = false;
  selectedId: string | null;
  appName = new FormControl('', [Validators.required]);
  iosVersionNumber = new FormControl('', [Validators.required]);
  androidVersionNumber = new FormControl('', [Validators.required]);
  appVersion$: Observable<any>;
  form: FormGroup;
  filters: object;
  appNames:any=[];


  constructor() {
    addIcons({ close });
  }

  ngOnInit(): void {
    this.versions();
    this.conversionService.convert(AppNames, this.appNames);
    this.form = this.formBuilder.group({
      appName: this.appName,
      iosVersionNumber: this.iosVersionNumber,
      androidVersionNumber: this.androidVersionNumber,
    });
  }

  showAdd() {
    this.selectedId = null;
    this.addModal = true;
    this.form.reset();
  }
  closeModal() {
    this.addModal = false;
  }

  versions() {
    this.appVersion$ = this.api.getMinimumAppVersions().pipe(
      tap((response: any) => {
        this.totalRecords = response.totalRecords;
      }),
      map((response: any) => response.data)
    );
  }

  proceed() {
    this.loading = true;
    this.addModal = false;

    const body = {
      iosVersionNumber: this.form.value.iosVersionNumber,
      androidVersionNumber: this.form.value.androidVersionNumber,
    };

    this.api
      .createAppMinimumVersion({ appName: this.form.value.appName, body })
      .subscribe({
        next: () => {
          this.toastr.success(
            this.editVersion
              ? 'App version Edited Successfully'
              : 'App Added Successfully'
          );
          this.loading = false;
          this.addModal = false;
          this.versions();
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  edit(item: any) {
    this.editVersion = true;
    this.form.patchValue({
      appName: item.appName,
      iosVersionNumber: item.iosVersionNumber,
      androidVersionNumber: item.androidVersionNumber,
    });
    this.addModal = true;
  }
}
