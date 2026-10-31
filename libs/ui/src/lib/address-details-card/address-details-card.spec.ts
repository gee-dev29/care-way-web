import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressDetailsCard } from './address-details-card';

describe('AddressDetailsCard', () => {
  let component: AddressDetailsCard;
  let fixture: ComponentFixture<AddressDetailsCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressDetailsCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddressDetailsCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
