import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAddressCustomer } from './select-address-customer';

describe('SelectAddressCustomer', () => {
  let component: SelectAddressCustomer;
  let fixture: ComponentFixture<SelectAddressCustomer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectAddressCustomer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectAddressCustomer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
