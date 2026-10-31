import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloodBankAddBank } from './blood-bank-add-bank';

describe('BloodBankAddBank', () => {
  let component: BloodBankAddBank;
  let fixture: ComponentFixture<BloodBankAddBank>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BloodBankAddBank]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BloodBankAddBank);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
