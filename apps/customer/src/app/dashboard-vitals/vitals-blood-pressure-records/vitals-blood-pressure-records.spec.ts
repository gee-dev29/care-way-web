import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VitalsBloodPressureRecords } from './vitals-blood-pressure-records';

describe('VitalsBloodPressureRecords', () => {
  let component: VitalsBloodPressureRecords;
  let fixture: ComponentFixture<VitalsBloodPressureRecords>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VitalsBloodPressureRecords]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VitalsBloodPressureRecords);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
