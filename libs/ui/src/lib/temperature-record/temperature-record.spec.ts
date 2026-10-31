import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemperatureRecord } from './temperature-record';

describe('TemperatureRecord', () => {
  let component: TemperatureRecord;
  let fixture: ComponentFixture<TemperatureRecord>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemperatureRecord]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemperatureRecord);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
