import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HmoPurchasedOrderDetailsCard } from './hmo-purchased-order-details-card';

describe('HmoPurchasedOrderDetailsCard', () => {
  let component: HmoPurchasedOrderDetailsCard;
  let fixture: ComponentFixture<HmoPurchasedOrderDetailsCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HmoPurchasedOrderDetailsCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HmoPurchasedOrderDetailsCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
