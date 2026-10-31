import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VitalsTemperatureRecords } from './vitals-temperature-records';

describe('VitalsTemperatureRecords', () => {
  let component: VitalsTemperatureRecords;
  let fixture: ComponentFixture<VitalsTemperatureRecords>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VitalsTemperatureRecords]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VitalsTemperatureRecords);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
