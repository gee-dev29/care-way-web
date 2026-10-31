import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickupAddressCard } from './pickup-address-card';

describe('PickupAddressCard', () => {
  let component: PickupAddressCard;
  let fixture: ComponentFixture<PickupAddressCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PickupAddressCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PickupAddressCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
