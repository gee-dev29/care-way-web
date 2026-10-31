import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderCapture } from './order-capture';

describe('OrderCapture', () => {
  let component: OrderCapture;
  let fixture: ComponentFixture<OrderCapture>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderCapture]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderCapture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
