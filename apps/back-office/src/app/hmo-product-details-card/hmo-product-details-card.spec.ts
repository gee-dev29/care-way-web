import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HmoProductDetailsCard } from './hmo-product-details-card';

describe('HmoProductDetailsCard', () => {
  let component: HmoProductDetailsCard;
  let fixture: ComponentFixture<HmoProductDetailsCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HmoProductDetailsCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HmoProductDetailsCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
