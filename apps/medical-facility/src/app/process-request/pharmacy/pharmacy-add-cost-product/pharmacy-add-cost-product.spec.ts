import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyAddCostProduct } from './pharmacy-add-cost-product';

describe('PharmacyAddCostProduct', () => {
  let component: PharmacyAddCostProduct;
  let fixture: ComponentFixture<PharmacyAddCostProduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmacyAddCostProduct]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PharmacyAddCostProduct);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
