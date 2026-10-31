import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalCategory } from './hospital-category';

describe('HospitalCategory', () => {
  let component: HospitalCategory;
  let fixture: ComponentFixture<HospitalCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HospitalCategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalCategory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
