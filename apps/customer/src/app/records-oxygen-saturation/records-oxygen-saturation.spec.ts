import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordsOxygenSaturation } from './records-oxygen-saturation';

describe('RecordsOxygenSaturation', () => {
  let component: RecordsOxygenSaturation;
  let fixture: ComponentFixture<RecordsOxygenSaturation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecordsOxygenSaturation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecordsOxygenSaturation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
