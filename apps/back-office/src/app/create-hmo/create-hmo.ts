import { CommonModule } from '@angular/common';
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
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiService } from '@healbridge/api';
import {
  PageBody,
  FormBody,
  DesktopInput,
  DesktopButton,
} from '@healbridge/ui';
import { ToastrService } from 'ngx-toastr';
import { v4 } from 'uuid';

@Component({
  selector: 'back-office-create-hmo',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PageBody,
    FormBody,
    DesktopInput,
    DesktopButton,
  ],
  templateUrl: './create-hmo.html',
  styleUrl: './create-hmo.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CreateHmo implements OnInit {
  api = inject(ApiService);
  router = inject(Router);
  toastr = inject(ToastrService);
  formBuilder = inject(FormBuilder);
  activatedRoute = inject(ActivatedRoute);

  name = new FormControl('', [Validators.required]);
  contactPerson = new FormControl('', [Validators.required]);
  contactEmail = new FormControl('', [Validators.required, Validators.email]);
  contactPhone = new FormControl('', [Validators.required]);
  address = new FormControl('', [Validators.required]);
  markUp = new FormControl('', [Validators.required]);
  url = new FormControl('', [Validators.required]);

  form: FormGroup;
  hmoId = v4();
  isEdit = false;

  ngOnInit(): void {
    this.initializeForm();
    this.activatedRoute.queryParams.subscribe((params: Params[string]) => {
      if (params.hmoId) {
        this.hmoId = params.hmoId;
        this.isEdit = true;
        this.form.patchValue({ ...params });
      }
    });
  }

  initializeForm() {
    this.form = this.formBuilder.group({
      name: this.name,
      contactPerson: this.contactPerson,
      contactEmail: this.contactEmail,
      contactPhone: this.contactPhone,
      address: this.address,
      markUp: this.markUp,
      url: this.url,
    });
  }

  save() {
    const payLoad = {
      hmoId: this.hmoId,
      ...this.form.value,
    };

    this.api.addHmo({ body: payLoad }).subscribe(() => {
      this.toastr.success(
        this.isEdit ? 'HMO Updated Successfully' : 'HMO Created Successfully'
      );
      this.router.navigate(['hmo-details', this.hmoId]);
    });
  }

  back() {
    this.router.navigate(['list-all-hmo']);
  }
}
