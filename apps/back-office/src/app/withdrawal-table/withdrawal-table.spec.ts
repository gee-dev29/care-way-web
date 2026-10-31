import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawalTable } from './withdrawal-table';

describe('WithdrawalTable', () => {
  let component: WithdrawalTable;
  let fixture: ComponentFixture<WithdrawalTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WithdrawalTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WithdrawalTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
