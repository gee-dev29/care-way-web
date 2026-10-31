import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacistSchedule } from './pharmacist-schedule';

describe('PharmacistSchedule', () => {
  let component: PharmacistSchedule;
  let fixture: ComponentFixture<PharmacistSchedule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmacistSchedule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PharmacistSchedule);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
