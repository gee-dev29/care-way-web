import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPharmacist } from './add-pharmacist';

describe('AddPharmacist', () => {
  let component: AddPharmacist;
  let fixture: ComponentFixture<AddPharmacist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPharmacist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPharmacist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
