import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPharmacist } from './all-pharmacist';

describe('AllPharmacist', () => {
  let component: AllPharmacist;
  let fixture: ComponentFixture<AllPharmacist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllPharmacist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllPharmacist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
