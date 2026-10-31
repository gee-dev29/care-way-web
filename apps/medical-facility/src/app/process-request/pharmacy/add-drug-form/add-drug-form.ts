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
import { ApiService } from '@care-way/api';
import { ConversionService } from '@care-way/shared';
import { InputComponent, ButtonComponent } from '@care-way/ui';
import { IonContent, IonIcon, IonModal } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { Subject, takeUntil } from 'rxjs';
import { v4 } from 'uuid';

@Component({
  selector: 'medical-facility-add-drug-form',
  imports: [
    IonContent,
    IonIcon,
    ReactiveFormsModule,
    CommonModule,
    InputComponent,
    ButtonComponent,
  ],
  templateUrl: './add-drug-form.html',
  styleUrl: './add-drug-form.css',
})
export class AddDrugForm implements OnInit {
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
  private destroy$ = new Subject<void>();
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
  selectedIngredient = '';
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
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe((params: any) => {
        this.serviceRequestId = params.serviceRequestId;
        this.memberId = params.memberId;
        this.facilityType = params.facilityType;
        this.greenBook = params.greenBook;
        this.facilityId = params.facilityId;
        this.ingredients = [];
        this.filterIngredients = [];
        this.api
          .getGreenBookGroupsByFilter({
            greenbookType: this.greenBook,
            filterType: 'Active Ingredients',
          } as any)
          .pipe(takeUntil(this.destroy$))
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

  offIngredient() {
    this.greenBookOpen = false;
  }

  goBack() {
    this.router.navigate([
      'dashboard',
      'pharmacy-cost-request-details',
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
    this.form.reset({
      form: '',
      activeIngredient: '',
      availability: true,
    });
    this.selectedIngredient = '';
    this.drugForms = [];
    this.loading = true;

    setTimeout(() => {
      this.router.navigate([
        'dashboard',
        'pharmacy-cost-request-details',
        this.facilityType,
        this.facilityId,
        this.serviceRequestId,
        this.memberId,
        this.greenBook,
        id,
      ]);
      this.loading = false;
    }, 1000);
  }

  async selectGreenBook() {
    this.active = false;
    this.greenBookOpen = false;

    const activeIngredient = this.form.value.activeIngredient;
    if (activeIngredient === this.selectedIngredient) return;
    this.selectedIngredient = activeIngredient;

    this.isForm = false;
    this.drugForms = [];
    this.tabletForm.reset('');

    if (!activeIngredient) return;

    this.api
      .getGreenBookGroupsByFilter({
        greenbookType: this.greenBook,
        activeIngredient,
        filterType: 'Form',
      } as any)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        this.drugForms = response.map((drug: any) => ({
          text: drug,
          value: drug,
        }));
      });
  }

  ionViewWillLeave(): void {
    this.destroy$.next();
  }
}
