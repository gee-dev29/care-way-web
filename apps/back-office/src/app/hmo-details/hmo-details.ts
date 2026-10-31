import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiService } from '@healbridge/api';
import {
  PageBody,
  Tab,
  UploadCard,
  DesktopButton,
  UploadComponent,
  DesktopUpload,
  DesktopInput,
  DesktopChips,
} from '@healbridge/ui';
import { Observable, tap } from 'rxjs';
import { HmoDetailsCard } from '../hmo-details-card/hmo-details-card';
import { HmoProductTable } from '../hmo-product-table/hmo-product-table';
import { HmoHospitalTable } from '../hmo-hospital-table/hmo-hospital-table';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { v4 } from 'uuid';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'back-office-hmo-details',
  imports: [
    CommonModule,
    PageBody,
    Tab,
    UploadCard,
    DesktopButton,
    UploadComponent,
    HmoDetailsCard,
    DesktopUpload,
    HmoProductTable,
    HmoHospitalTable,
    DesktopInput,
    ReactiveFormsModule,
    DesktopChips,
  ],
  templateUrl: './hmo-details.html',
  styleUrl: './hmo-details.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HmoDetails implements OnInit {
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  api = inject(ApiService);
  formBuilder = inject(FormBuilder);
  toastr = inject(ToastrService);
  

  uploads$: Observable<any>;
  hmoDetails$: Observable<any>;

  isUploadLogo = false;
  loading = false;
  isCreateProductModal = false;
  form: FormGroup;
  productName = new FormControl('', [Validators.required]);
  price = new FormControl('', [Validators.required]);
  markUp = new FormControl('', [Validators.required]);
  durationInMonths = new FormControl('', [Validators.required]);
  memberCount = new FormControl('', [Validators.required]);
  waitingPeriods = new FormControl('', [Validators.required]);
  inclusions = new FormControl([], [Validators.required]);
  exclusions = new FormControl([], [Validators.required]);

  @ViewChild(HmoProductTable) hmoProductTable: HmoProductTable;

  hmoId: string;
  reloadProducts = false;
  editingHmoProductId: string | null = null;

  activeTab = 0;
  tabs = [
    { title: 'Details', value: 0, content: 'Details' },
    { title: 'HMO Products', value: 1, content: 'HMO Products' },
    { title: 'Hospitals', value: 2, content: 'Hospitals' },
  ];

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params[string]) => {
      this.hmoId = params.hmoId;
      this.getHmoDetails(this.hmoId);
      this.getUploads();
    });
    this.initializeForm();
  }

  initializeForm() {
    this.form = this.formBuilder.group({
      productName: this.productName,
      price: this.price,
      markUp: this.markUp,
      durationInMonths: this.durationInMonths,
      memberCount: this.memberCount,
      waitingPeriods: this.waitingPeriods,
      inclusions: this.inclusions,
      exclusions: this.exclusions,
    });
  }

  getHmoDetails(hmoId: any) {
    this.hmoDetails$ = this.api.getHmo({ hmoId: hmoId });
  }

  showUpload() {
    this.isUploadLogo = true;
  }

  getUploads() {
    this.uploads$ = this.api.getUploads({
      referencedDocumentId: this.hmoId,
    });
  }

  uploadImage(file: any) {
    this.api
      .uploadFile({
        referencedDocumentId: this.hmoId,
        body: file,
      })
      .subscribe(() => {
        this.getUploads();
        this.isUploadLogo = false;
        this.toastr.success('Uploaded Successfully');
      });
  }

  showCreateProductModal() {
    this.editingHmoProductId = null;
    this.form.reset();
    this.isCreateProductModal = true;
  }

  editHmoDetails(item: any) {
    this.router.navigate(['create-hmo'], {
      queryParams: { ...item, hmoId: item.hmoId },
    });
  }

  editHmoProduct(item: any) {
    this.editingHmoProductId = item.hmoProductId;

    this.inclusions.setValue(
      item.inclusions
        ? item.inclusions
            .split(',')
            .map((value: string) => value.trim())
            .filter((value: string) => value)
        : []
    );

    this.exclusions.setValue(
      item.exclusions
        ? item.exclusions
            .split(',')
            .map((value: string) => value.trim())
            .filter((value: string) => value)
        : []
    );

    this.form.patchValue({
      productName: item.productName,
      price: item.price,
      markUp: item.markUp,
      durationInMonths: item.durationInMonths,
      memberCount: item.memberCount,
      waitingPeriods: item.waitingPeriods,
    });

    this.isCreateProductModal = true;
  }

  productsLoaded() {
    this.reloadProducts = false;
  }

  saveProduct() {
    const isEditing = this.editingHmoProductId;

    const payLoad = {
      hmoProductId: this.editingHmoProductId || v4(),
      ...this.form.value,
      inclusions: this.inclusions.value?.join(', ') || '',
      exclusions: this.exclusions.value?.join(', ') || '',
    };

    this.api
      .addHmoProduct({ hmoId: this.hmoId, body: payLoad })
      .subscribe(() => {
        this.isCreateProductModal = false;
        this.form.reset();
        this.editingHmoProductId = null;
        this.reloadProducts = true;
        this.toastr.success(
          isEditing
            ? 'HMO Product Updated Successfully'
            : 'HMO Product Created Successfully'
        );
      });
  }

  addHospital() {
    this.router.navigate(['create-hmo-hospital' , this.hmoId]);
  }

  back() {
    this.router.navigate(['list-all-hmo']);
  }
}
