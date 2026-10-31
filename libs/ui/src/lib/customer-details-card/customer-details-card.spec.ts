import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDetailsCard } from './customer-details-card';

describe('CustomerDetailsCard', () => {
  let component: CustomerDetailsCard;
  let fixture: ComponentFixture<CustomerDetailsCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerDetailsCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerDetailsCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
