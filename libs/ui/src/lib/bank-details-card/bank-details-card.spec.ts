import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankDetailsCard } from './bank-details-card';

describe('BankDetailsCard', () => {
  let component: BankDetailsCard;
  let fixture: ComponentFixture<BankDetailsCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankDetailsCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankDetailsCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
