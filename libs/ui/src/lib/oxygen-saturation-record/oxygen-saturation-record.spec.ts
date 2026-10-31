import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OxygenSaturationRecord } from './oxygen-saturation-record';

describe('OxygenSaturationRecord', () => {
  let component: OxygenSaturationRecord;
  let fixture: ComponentFixture<OxygenSaturationRecord>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OxygenSaturationRecord]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OxygenSaturationRecord);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
