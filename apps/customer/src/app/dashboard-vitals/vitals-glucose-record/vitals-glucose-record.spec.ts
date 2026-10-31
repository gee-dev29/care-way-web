import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VitalsGlucoseRecord } from './vitals-glucose-record';

describe('VitalsGlucoseRecord', () => {
  let component: VitalsGlucoseRecord;
  let fixture: ComponentFixture<VitalsGlucoseRecord>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VitalsGlucoseRecord]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VitalsGlucoseRecord);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
