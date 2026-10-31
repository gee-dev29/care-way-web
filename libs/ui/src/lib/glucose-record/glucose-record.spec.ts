import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlucoseRecord } from './glucose-record';

describe('GlucoseRecord', () => {
  let component: GlucoseRecord;
  let fixture: ComponentFixture<GlucoseRecord>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlucoseRecord]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlucoseRecord);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
