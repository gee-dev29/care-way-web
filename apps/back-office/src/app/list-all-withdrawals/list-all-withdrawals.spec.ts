import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAllWithdrawals } from './list-all-withdrawals';

describe('ListAllWithdrawals', () => {
  let component: ListAllWithdrawals;
  let fixture: ComponentFixture<ListAllWithdrawals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAllWithdrawals]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAllWithdrawals);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
