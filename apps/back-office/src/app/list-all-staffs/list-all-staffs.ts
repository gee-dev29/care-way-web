import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, NonProfessionalUserType } from '@healbridge/api';
import { ConversionService, Gender } from '@healbridge/shared';
import {
  PageBody,
  DesktopButton,
  Modal,
  DesktopInput,
  InputDropDownComponent,
  FormBody,
} from '@healbridge/ui';
import { IonModal } from '@ionic/angular/common';
import { ToastrService } from 'ngx-toastr';
import { TableModule } from 'primeng/table';
import { map, Observable, tap } from 'rxjs';
import { v4 } from 'uuid';
import { UserTable } from '../user-table/user-table';

@Component({
  selector: 'back-office-list-all-staffs',
  imports: [
    CommonModule,
    PageBody,
    DesktopButton,
    TableModule,
    Modal,
    DesktopInput,
    ReactiveFormsModule,
    InputDropDownComponent,
    UserTable,
  ],
  templateUrl: './list-all-staffs.html',
  styleUrl: './list-all-staffs.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ListAllStaffs implements OnInit {
  api = inject(ApiService);
  formBuilder = inject(FormBuilder);
  conversion = inject(ConversionService);
  router = inject(Router);
  toastr = inject(ToastrService);
  staffs$: Observable<any>;
  totalRecords = 0;
  filters: object;
  addStaffModal: boolean = false;
  form: FormGroup;
  firstName = new FormControl('', [Validators.required]);
  lastName = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required, Validators.email]);
  phone = new FormControl('', [
    Validators.required,
    Validators.pattern('^[0-9]{11}$'),
  ]);
  gender = new FormControl('', [Validators.required]);
  userId = new FormControl(v4(), Validators.required);
  userType = new FormControl(
    NonProfessionalUserType.Staff,
    Validators.required
  );
  genders: { key: string; value: string }[] = [];

  ngOnInit(): void {
    this.conversion.convert(Gender, this.genders);
    this.initializeForm();
  }

  initializeForm() {
    this.form = this.formBuilder.group({
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
      gender: this.gender,
      userId: this.userId,
      userType: this.userType,
      userTypeId: this.userId,
    });
  }

  load(event: any) {
    this.filters = {
      ...this.filters,
      userType: NonProfessionalUserType.Staff,
      skip: event.first,
      limit: event.rows,
      firstName: event.filters.firstName?.value || undefined,
      lastName: event.filters.lastName?.value || undefined,
      email: event.filters.email?.value || undefined,
      phone: event.filters.phone?.value || undefined,
    };
    this.getAllStaffs();
  }

  getAllStaffs() {
    this.staffs$ = this.api.getAllUsers({ ...this.filters }).pipe(
      tap((response: any) => {
        this.totalRecords = response.totalRecords;
      }),
      map((response: any) => response.data)
    );
  }

  showAddStaffModal() {
    this.addStaffModal = true;
  }

  view(event: any) {
    this.router.navigate(['staff-details', event.userId]);
  }

  save() {
    this.api.signUpUser({ body: this.form.value }).subscribe(() => {
      this.toastr.success('Staff created successfully');
      this.addStaffModal = false;
      this.form.reset();
      this.getAllStaffs();
    });
  }
}
