import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBankRider } from './add-bank-rider';

describe('AddBankRider', () => {
  let component: AddBankRider;
  let fixture: ComponentFixture<AddBankRider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBankRider]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBankRider);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
