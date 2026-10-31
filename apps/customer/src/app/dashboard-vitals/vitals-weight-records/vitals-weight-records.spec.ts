import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VitalsWeightRecords } from './vitals-weight-records';

describe('VitalsWeightRecords', () => {
  let component: VitalsWeightRecords;
  let fixture: ComponentFixture<VitalsWeightRecords>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VitalsWeightRecords]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VitalsWeightRecords);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
