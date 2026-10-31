import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasurementPicker } from './measurement-picker';

describe('MeasurementPicker', () => {
  let component: MeasurementPicker;
  let fixture: ComponentFixture<MeasurementPicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeasurementPicker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeasurementPicker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
