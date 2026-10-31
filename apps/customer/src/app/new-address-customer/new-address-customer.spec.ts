import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAddressCustomer } from './new-address-customer';

describe('NewAddressCustomer', () => {
  let component: NewAddressCustomer;
  let fixture: ComponentFixture<NewAddressCustomer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewAddressCustomer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewAddressCustomer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
