import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiService, GreenBookType } from '@care-way/api';
import {
  ConversionService,
  Export,
  GreenBookItemStatus,
} from '@care-way/shared';
import {
  DesktopButton,
  Modal,
  DesktopInput,
  InputDropDownComponent,
} from '@care-way/ui';
import { ToastrService } from 'ngx-toastr';
import { TableModule } from 'primeng/table';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { v4 } from 'uuid';

@Component({
  selector: 'back-office-green-book-table',
  imports: [
    CommonModule,
    DesktopButton,
    ReactiveFormsModule,
    Modal,
    TableModule,
    DesktopInput,
    InputDropDownComponent,
  ],
  templateUrl: './green-book-table.html',
  styleUrl: './green-book-table.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class GreenBookTable implements OnInit {
  conversionService = inject(ConversionService);
  toastr = inject(ToastrService);
  api = inject(ApiService);
  exportService = inject(Export);
  formBuilder = inject(FormBuilder);
  @Input() greenBookType: any;
  @Input() heading = '';
  greenBooks$: Observable<any>;
  loading = false;
  id: string;
  greenBookId: string | null;
  filters: object;
  totalRecords: number;
  greenBookFormModal: boolean;
  greenBookForm: FormGroup;
  statusFilter = new BehaviorSubject<any>('');
  activeIngredientFilter = new BehaviorSubject<any>('');
  formFilter = new BehaviorSubject<any>('');
  statuses: { key: string; value: string }[] = [];
  activeIngredients: { key: string; value: string }[] = [];
  forms: { key: string; value: string }[] = [];
  productName = new FormControl('', [Validators.required]);
  activeIngredient = new FormControl('', [Validators.required]);
  nrn = new FormControl('', [Validators.required]);
  roa = new FormControl('', [Validators.required]);
  form = new FormControl('', [Validators.required]);
  strength = new FormControl('', [Validators.required]);
  status = new FormControl('', [Validators.required]);
  applicantName = new FormControl('', [Validators.required]);

  ngOnInit(): void {
    this.initializeForm();
    this.getAllGreenBookItems(this.filters);
    this.conversionService.convert(GreenBookItemStatus, this.statuses);
    this.getActiveIngredients();
    this.getForms();
  }

  filterByStatus(event: any) {
    this.statusFilter.next(event);
  }

  filterByActiveIngredients(event: any) {
    this.activeIngredientFilter.next(event);
  }

  filterByForms(event: any) {
    this.formFilter.next(event);
  }

  initializeForm() {
    this.greenBookForm = this.formBuilder.group({
      productName: this.productName,
      activeIngredient: this.activeIngredient,
      nrn: this.nrn,
      form: this.form,
      roa: this.roa,
      strength: this.strength,
      applicantName: this.applicantName,
      status: this.status,
    });
  }

  getActiveIngredients() {
    this.api
      .getGreenBookGroupsByFilter({
        greenbookType: this.greenBookType,
        filterType: 'Active Ingredients',
      } as any)
      .subscribe((response: any) => {
        this.activeIngredients = response.map((item: any) => ({
          key: item,
          value: item,
        }));
      });
  }

  getForms() {
    this.api
      .getGreenBookGroupsByFilter({
        greenbookType: this.greenBookType,
        filterType: 'Form',
      } as any)
      .subscribe((response: any) => {
        this.forms = response.map((item: any) => ({
          key: item,
          value: item,
        }));
      });
  }

  getAllGreenBookItems(filter: any) {
    this.greenBooks$ = this.api
      .getGreenBookItems({
        greenbookType: this.greenBookType,
        ...filter,
      })
      .pipe(
        tap((response: any) => {
          this.totalRecords = response.totalRecords;
        }),
        map((response: any) => response.data)
      );
  }

  load(event: any) {
    this.filters = {
      skip: event.first,
      limit: event.rows,
      productName: event.filters.productName?.value || undefined,
      activeIngredient: event.filters.activeIngredient?.value || undefined,
      form: event.filters.form?.value || undefined,
      status: event.filters.status?.value || undefined,
    };
    this.activeIngredientFilter.subscribe((activeIngredient) => {
      this.filters = {
        ...this.filters,
        activeIngredient: activeIngredient?.value || undefined,
      };
      this.getAllGreenBookItems(this.filters);
    });
    this.formFilter.subscribe((form) => {
      this.filters = {
        ...this.filters,
        form: form?.value || undefined,
      };
      this.getAllGreenBookItems(this.filters);
    });
    this.statusFilter.subscribe((status) => {
      this.filters = {
        ...this.filters,
        status: status?.value,
      };
      this.getAllGreenBookItems(this.filters);
    });
    this.getAllGreenBookItems(this.filters);
  }

  showAddGreenBookModal() {
    this.greenBookId = null;
    this.greenBookFormModal = true;
    this.greenBookForm.reset();
  }

  export() {
    this.api
      .getGreenBookItems({
        ...this.filters,
        limit: this.totalRecords,
        greenbookType: this.greenBookType,
      })
      .subscribe((greenBooks: any) => {
        this.exportService.exportExcel(greenBooks.data, this.greenBookType);
      });
  }

  edit(event: any) {
    this.greenBookId = event.id;
    this.greenBookForm.patchValue({
      ...event,
    });
    this.greenBookFormModal = true;
  }

  saveGreenBookItem() {
    this.loading = true;
    const payLoad = {
      greenbookType: this.greenBookType,
      greenbookId: this.greenBookId ?? v4(),
      body: {
        ...this.greenBookForm.value,
        greenBookItemType: this.greenBookType,
      },
    };
    this.api.addGreenbookItem(payLoad).subscribe({
      next: () => {
        this.toastr.success(
          this.greenBookId
            ? 'Green Book Item Edited Successfully'
            : 'Green Book Item Added Successfully'
        );
        this.loading = false;
        this.greenBookFormModal = false;
        this.getAllGreenBookItems(this.filters);
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
