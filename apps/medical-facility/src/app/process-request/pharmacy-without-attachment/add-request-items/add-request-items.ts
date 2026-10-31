import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormControl,
  Validators,
  FormGroup,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@healbridge/api';
import { ConversionService, DrugsForms } from '@healbridge/shared';
import { InputComponent, ButtonComponent, Item } from '@healbridge/ui';
import {
  IonContent,
  IonIcon,
  IonModal,
  IonRadio,
  IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { v4 } from 'uuid';

@Component({
  selector: 'medical-facility-add-request-items',
  imports: [
    IonContent,
    IonIcon,
    IonText,
    ReactiveFormsModule,
    CommonModule,
    InputComponent,
    ButtonComponent,
    IonRadio,
  ],
  templateUrl: './add-request-items.html',
  styleUrl: './add-request-items.css',
})
export class AddRequestItems implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  tabletForm = new FormControl('', Validators.required);
  availability = new FormControl(true, Validators.required);
  private conversion = inject(ConversionService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  facilityId: string;
  facilityType: string;
  serviceRequestId: string;
  memberId: string;
  greenBook: string;
  greenBookOpen = false;
  form: FormGroup;
  @ViewChild('modal') modal: IonModal;
  active = false;
  canDismiss = false;
  ingredients: any = [];
  filterIngredients: any = [];

  drugForms: any = [];
  available = [
    {
      value: true,
      text: 'Yes',
    },
    {
      value: false,
      text: 'No',
    },
  ];
  activeIngredients: '';
  isForm = false;
  loading = false;
  isDisabled: boolean;

  constructor() {
    addIcons({
      chevronBackOutline,
    });
  }

  ngOnInit() {
    this.isDisabled = false;
    this.activatedRoute.params.subscribe((params: any) => {
      this.serviceRequestId = params.serviceRequestId;
      this.memberId = params.memberId;
      this.facilityType = params.facilityType;
      this.greenBook = params.greenBook;
      this.facilityId = params.facilityId;
      this.api
        .getGreenBookGroupsByFilter({
          greenbookType: this.greenBook,
          filterType: 'Active Ingredients',
        } as any)
        .subscribe((response: any) => {
          response.forEach((drug: any) => {
            this.ingredients.push({ text: drug, value: drug });
            this.filterIngredients.push({ text: drug, value: drug });
          });
        });
    });
    this.form = this.fb.group({
      form: this.tabletForm,
      activeIngredient: ['', Validators.required],
      availability: this.availability,
    });
  }

  isFormClicked() {
    this.isForm = true;
  }
  offFormClicked() {
    this.isForm = false;
  }

  openIngredient() {
    this.greenBookOpen = true;
  }

  checkIngrdient(letter: any) {
    this.ingredients = [];
    if (letter.length == 0) {
      this.greenBookOpen = false;
      this.ingredients = this.filterIngredients;
    }
    this.filterIngredients.filter((req: any) => {
      if (req.value.toLowerCase().includes(letter.toLowerCase())) {
        this.ingredients.push(req);
      }
    });
  }

  goBack() {
    this.router.navigate([
      'dashboard',
      'no-attachment-request-details',
      this.facilityType,
      this.facilityId,
      this.serviceRequestId,
      this.memberId,
    ]);
  }
  next() {
    if (!this.form.valid) return;
    const { form, availability, activeIngredient } = this.form.value;
    const id = v4();
    const newItem = {
      id,
      form,
      availability,
      activeIngredient,
      greenBook: this.greenBook,
      products: [],
    };

    const stored = localStorage.getItem('activeIngredients');
    const activeIngredients = stored ? JSON.parse(stored) : [];

    activeIngredients.push(newItem);
    localStorage.setItem(
      'activeIngredients',
      JSON.stringify(activeIngredients)
    );
    this.form.patchValue({
      form: '',
      activeIngredient: '',
      availability: '',
    });
    this.router.navigate([
      'dashboard',
      'no-attachment-request-details',
      this.facilityType,
      this.facilityId,
      this.serviceRequestId,
      this.memberId,
      this.greenBook,
      id,
    ]);
  }

  async selectGreenBook(activeIngredient: any) {
    this.active = false;
    this.greenBookOpen = false;
    this.form.patchValue({ activeIngredient: activeIngredient });
    this.api
      .getGreenBookGroupsByFilter({
        greenbookType: this.greenBook,
        activeIngredient: activeIngredient,
        filterType: 'Form',
      } as any)
      .subscribe((response: any) => {
        response.forEach((drug: any) => {
          this.drugForms.push({ text: drug, value: drug });
        });
      });
  }
}
