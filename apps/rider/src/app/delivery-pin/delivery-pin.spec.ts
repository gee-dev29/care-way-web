import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryPin } from './delivery-pin';

describe('DeliveryPin', () => {
  let component: DeliveryPin;
  let fixture: ComponentFixture<DeliveryPin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryPin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryPin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
