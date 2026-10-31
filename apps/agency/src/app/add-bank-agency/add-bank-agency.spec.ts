import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBankAgency } from './add-bank-agency';

describe('AddBankAgency', () => {
  let component: AddBankAgency;
  let fixture: ComponentFixture<AddBankAgency>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBankAgency]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBankAgency);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
