import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ApiService } from '@healbridge/api';
import { PageBody, DesktopButton, Modal, DesktopInput } from '@healbridge/ui';
import { IonModal } from '@ionic/angular/standalone';
import { TableModule } from 'primeng/table';
import { Observable, tap } from 'rxjs';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { v4 } from 'uuid';
import { addIcons } from 'ionicons';
import { close } from 'ionicons/icons';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'back-office-hospital-specialization',
  imports: [
    PageBody,
    DesktopButton,
    TableModule,
    CommonModule,
    Modal,
    FormsModule,
    ReactiveFormsModule,
    DesktopInput,
  ],
  templateUrl: './hospital-specialization.html',
  styleUrl: './hospital-specialization.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HospitalSpecialization implements OnInit {
  api = inject(ApiService);
  formBuilder = inject(FormBuilder);
  toastr = inject(ToastrService);
  @ViewChild(IonModal) modal!: IonModal;
  loading = false;
  totalRecords = 0;
  addModal = false;
  selectedId: string | null;
  specialization = new FormControl('', [Validators.required]);
  hospitalSpecialization$: Observable<any>;
  form: FormGroup;
  filters: object;

  constructor() {
    addIcons({ close });
  }

  ngOnInit(): void {
    this.loadSpecializations();

    this.form = this.formBuilder.group({
      specialization: this.specialization,
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

  loadSpecializations() {
    this.hospitalSpecialization$ = this.api.getHospitalSpecializations().pipe(
      tap((response: any) => {
        this.totalRecords = response.length;
      })
    );
  }

  selectSpecialization() {
    this.loading = true;
    this.addModal = false;

    const payload = {
      specializationId: this.selectedId ?? v4(),
      body: {
        name: this.form.value.specialization,
      },
    };

    this.api.addHospitalSpecialization(payload).subscribe({
      next: () => {
        this.toastr.success(
          this.selectedId
            ? 'Specialization Edited Successfully'
            : 'Specialization Added Successfully'
        );
        this.loading = false;
        this.addModal = false;
        this.loadSpecializations();
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  edit(item: any) {
    this.selectedId = item.hospitalSpecializationId;
    this.form.patchValue({
      specialization: item.name,
    });
    this.addModal = true;
  }
}
