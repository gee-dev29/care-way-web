import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankTables } from './bank-tables';

describe('BankTables', () => {
  let component: BankTables;
  let fixture: ComponentFixture<BankTables>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankTables]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankTables);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
