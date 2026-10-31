import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalCategoryDetailsCard } from './hospital-category-details-card';

describe('HospitalCategoryDetailsCard', () => {
  let component: HospitalCategoryDetailsCard;
  let fixture: ComponentFixture<HospitalCategoryDetailsCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HospitalCategoryDetailsCard],
    }).compileComponents();

    fixture = TestBed.createComponent(HospitalCategoryDetailsCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
