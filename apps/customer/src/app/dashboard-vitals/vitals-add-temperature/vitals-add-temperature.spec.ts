import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VitalsAddTemperature } from './vitals-add-temperature';

describe('VitalsAddTemperature', () => {
  let component: VitalsAddTemperature;
  let fixture: ComponentFixture<VitalsAddTemperature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VitalsAddTemperature]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VitalsAddTemperature);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
