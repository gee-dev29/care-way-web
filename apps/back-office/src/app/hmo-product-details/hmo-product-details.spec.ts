import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HmoProductDetails } from './hmo-product-details';

describe('HmoProductDetails', () => {
  let component: HmoProductDetails;
  let fixture: ComponentFixture<HmoProductDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HmoProductDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HmoProductDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
