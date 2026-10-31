import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditOrDebitDetails } from './credit-or-debit-details';

describe('CreditOrDebitDetails', () => {
  let component: CreditOrDebitDetails;
  let fixture: ComponentFixture<CreditOrDebitDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditOrDebitDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditOrDebitDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
