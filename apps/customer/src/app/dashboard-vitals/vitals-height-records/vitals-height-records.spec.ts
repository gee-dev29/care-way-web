import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VitalsHeightRecords } from './vitals-height-records';

describe('VitalsHeightRecords', () => {
  let component: VitalsHeightRecords;
  let fixture: ComponentFixture<VitalsHeightRecords>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VitalsHeightRecords]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VitalsHeightRecords);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
