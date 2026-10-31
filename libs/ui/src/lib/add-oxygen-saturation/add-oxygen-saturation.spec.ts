import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOxygenSaturation } from './add-oxygen-saturation';

describe('AddOxygenSaturation', () => {
  let component: AddOxygenSaturation;
  let fixture: ComponentFixture<AddOxygenSaturation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddOxygenSaturation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOxygenSaturation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
