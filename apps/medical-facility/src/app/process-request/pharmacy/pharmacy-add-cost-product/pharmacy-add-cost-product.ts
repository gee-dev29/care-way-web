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
import { ApiService, GreenBookType } from '@healbridge/api';
import { ConversionService, UOM } from '@healbridge/shared';
import {
  ButtonComponent,
  InputComponent,
  ConfirmationModal,
  LimitSize,
} from '@healbridge/ui';
import {
  IonContent,
  IonIcon,
  IonModal,
  IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, createOutline, trashOutline } from 'ionicons/icons';
import { v4 } from 'uuid';

@Component({
  selector: 'medical-facility-pharmacy-add-cost-product',
  imports: [
    IonContent,
    IonIcon,
    IonText,
    ReactiveFormsModule,
    CommonModule,
    InputComponent,
    ButtonComponent,
    IonModal,
    ConfirmationModal,
  ],
  templateUrl: './pharmacy-add-cost-product.html',
  styleUrl: './pharmacy-add-cost-product.css',
})
export class PharmacyAddCostProduct implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  confirmSwitchModalOpen = false;
  editModal = false;
  quantity = new FormControl(1, [Validators.required, Validators.min(1)]);
  uom = new FormControl('', Validators.required);
  product = new FormControl('', Validators.required);
  strength = new FormControl('', Validators.required);
  cost = new FormControl(0, [Validators.required, Validators.min(1)]);
  addCostProduct = false;
  private router = inject(Router);
  facilityId: string;
  uoms: any = [];
  facilityType: string;
  serviceRequestId: string;
  memberId: string;
  selectedParentId!: string;
  selectedChildId!: string;
  facilityTypeId: any;
  childId: string;
  parentId: string;
  active = false;
  greenBook: string;
  form: FormGroup;
  id: any;
  loading = false;
  getUom = false;
  data: any;
  oneData: any;
  activeIngredient: any = [];
  private conversionService = inject(ConversionService);

  greenBookOpen = false;
  ingredientId: string;
  ingredients: any = [];
  filterIngredients: any = [];

  ngOnInit(): void {
    this.form = this.fb.group({
      product: this.product,
      strength: this.strength,
      quantity: this.quantity,
      cost: this.cost,
      uom: this.uom,
    });
    this.route.params.subscribe((params: any) => {
      this.id = params.id;
      this.serviceRequestId = params.serviceRequestId;
      this.memberId = params.memberId;
      this.facilityType = params.facilityType;
      this.greenBook = params.greenBook;
      this.facilityId = params.facilityId;
      this.ingredientId = params.ingredientId;
      this.api
        .getFacilityTypesOfFacility({ facilityId: this.facilityId })
        .subscribe((res: any) => {
          res.filter((each: any) => {
            if (each.facilityType == this.facilityType) {
              this.facilityTypeId = JSON.parse(
                localStorage.getItem('facilityTypeId') as any
              );
            }
          });
        });
      this.dataFromLocalStorage();
      if (this.greenBook === GreenBookType.Drugs) {
        this.form.setControl('uom', this.uom);
      }
    });

    this.conversionService.convert(UOM, this.uoms);
  }

  constructor() {
    addIcons({
      addOutline,
      createOutline,
      trashOutline,
    });
  }

  dataFromLocalStorage() {
    this.ingredients = [];
    this.filterIngredients = [];
    const stored = localStorage.getItem('activeIngredients');
    this.activeIngredient = stored ? JSON.parse(stored) : [];
    this.data = this.activeIngredient;
    this.activeIngredient.filter((response: any) => {
      if (response.id === this.ingredientId) {
        this.oneData = response;
        this.api
          .getGreenBookItems({
            greenbookType: this.greenBook,
            activeIngredient: response.activeIngredient,
            form: response.form,
            skip: 0,
            limit: LimitSize.DropDown,
          } as any)
          .subscribe((response2: any) => {
            response2.data.forEach((drug: any) => {
              this.ingredients.push({
                text: drug.productName,
                value: drug.strength,
              });
              this.filterIngredients.push({
                text: drug.productName,
                value: drug.strength,
              });
            });
          });
      }
    });
  }
  goBack() {
    this.router.navigate([
      'dashboard',
      'pharmacy-cost-request-details',
      this.facilityType,
      this.facilityId,
      this.serviceRequestId,
      this.memberId,
      'add-drug-form',
      'Drugs',
    ]);
  }

  showAddCostProduct() {
    // this.imageView = this.uploadedDocuments[i].url;
    this.addCostProduct = true;
  }

  next() {
    const { product, strength, cost, quantity, uom } = this.form.value;

    const index = this.activeIngredient.findIndex(
      (item: any) => item.id === this.oneData.id
    );

    const newProduct = {
      product,
      strength,
      cost,
      quantity,
      uom,
      id: v4(),
    };

    this.activeIngredient[index].products.push(newProduct);

    localStorage.setItem(
      'activeIngredients',
      JSON.stringify(this.activeIngredient)
    );

    this.addCostProduct = false;

    this.dataFromLocalStorage();
    this.form.patchValue({
      product: '',
      strength: '',
      cost: '',
      quantity: '',
      uom: '',
    });
  }

  save() {
    this.loading = true;
    this.oneData.products.forEach((each: any, index: any) => {
      const costingId = v4();
      this.api
        .createCostEntryForServiceRequest({
          serviceRequestId: this.serviceRequestId,
          facilityTypeId: this.facilityTypeId,
          costingId: costingId,
          body: {
            activeIngredient: this.oneData.activeIngredient,
            form: this.oneData.form,
            strength: each.strength,
            product: each.product,
            cost: Number(each.cost),
            quantity: Number(each.quantity),
            uom: each.uom,
            type: this.greenBook,
          },
        } as any)
        .subscribe({
          next: () => {
            this.loading = false;
            this.form.patchValue({
              product: '',
              strength: '',
              quantity: '',
              cost: 1,
              uom: '',
            });
            this.router.navigate([
              'dashboard',
              'pharmacy-cost-request-details',
              this.facilityType,
              this.facilityId,
              this.serviceRequestId,
              this.memberId,
            ]);
          },
          error: () => {
            this.loading = false;
          },
        });
    });
  }

  openIngredient() {
    this.greenBookOpen = true;
  }
  openUom() {
    this.getUom = true;
  }

  offIngredient() {
    this.greenBookOpen = false;
  }

  selectGreenBook() {
    // this.form.patchValue({ product: item.text, strength: item.value });
    this.active = false;
    this.greenBookOpen = false;
  }
  selectUom(uom: any) {
    this.form.patchValue({ uom: uom });
    this.getUom = false;
  }

  onDelete() {
    const parent = this.data.find((item: any) => item.id === this.parentId);

    if (!parent) return;

    parent.products = parent.products.filter((p: any) => p.id !== this.childId);

    localStorage.setItem('activeIngredients', JSON.stringify(this.data));
    this.confirmSwitchModalOpen = false;
    this.dataFromLocalStorage();
  }

  onEdit(parentId: string, childId: string) {
    this.selectedParentId = parentId;
    this.selectedChildId = childId;

    const parent = this.data.find((item: any) => item.id === parentId);

    if (!parent) return;

    const product = parent.products.find((p: any) => p.id === childId);

    if (!product) return;

    this.form.patchValue(product);
    this.editModal = true;
  }

  nextTwo() {
    const { product, strength, cost, quantity, uom } = this.form.value;

    const parent = this.data.find(
      (item: any) => item.id === this.selectedParentId
    );

    if (!parent) return;

    this.loading = true;

    const productIndex = parent.products.findIndex(
      (p: any) => p.id === this.selectedChildId
    );

    if (productIndex === -1) return;

    parent.products[productIndex] = {
      ...parent.products[productIndex],
      product,
      strength,
      cost,
      quantity,
      uom,
    };

    setTimeout(() => {
      localStorage.setItem('activeIngredients', JSON.stringify(this.data));
      this.loading = false;
      this.editModal = false;
      this.dataFromLocalStorage();
      this.form.patchValue({
        product: '',
        strength: '',
        cost: '',
        quantity: '',
        uom: '',
      });
    }, 1000);
  }

  toggleDeleteBtn(parentId: string, childId: string) {
    this.confirmSwitchModalOpen = true;
    this.parentId = parentId;
    this.childId = childId;
  }
}
