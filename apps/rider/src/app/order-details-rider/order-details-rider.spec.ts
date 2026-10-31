import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailsRider } from './order-details-rider';

describe('OrderDetailsRider', () => {
  let component: OrderDetailsRider;
  let fixture: ComponentFixture<OrderDetailsRider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderDetailsRider]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderDetailsRider);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
