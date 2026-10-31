import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalBankList } from './hospital-bank-list';

describe('HospitalBankList', () => {
  let component: HospitalBankList;
  let fixture: ComponentFixture<HospitalBankList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HospitalBankList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalBankList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
