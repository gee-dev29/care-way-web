import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyWalletHistory } from './agency-wallet-history';

describe('AgencyWalletHistory', () => {
  let component: AgencyWalletHistory;
  let fixture: ComponentFixture<AgencyWalletHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgencyWalletHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgencyWalletHistory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
