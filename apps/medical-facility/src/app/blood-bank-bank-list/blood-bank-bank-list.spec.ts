import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloodBankBankList } from './blood-bank-bank-list';

describe('BloodBankBankList', () => {
  let component: BloodBankBankList;
  let fixture: ComponentFixture<BloodBankBankList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BloodBankBankList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BloodBankBankList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
