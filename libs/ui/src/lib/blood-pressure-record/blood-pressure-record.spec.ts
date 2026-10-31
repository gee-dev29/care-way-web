import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloodPressureRecord } from './blood-pressure-record';

describe('BloodPressureRecord', () => {
  let component: BloodPressureRecord;
  let fixture: ComponentFixture<BloodPressureRecord>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BloodPressureRecord]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BloodPressureRecord);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
