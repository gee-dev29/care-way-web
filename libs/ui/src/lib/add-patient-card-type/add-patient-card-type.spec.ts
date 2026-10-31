import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPatientCardType } from './add-patient-card-type';

describe('AddPatientCardType', () => {
  let component: AddPatientCardType;
  let fixture: ComponentFixture<AddPatientCardType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPatientCardType]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPatientCardType);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
