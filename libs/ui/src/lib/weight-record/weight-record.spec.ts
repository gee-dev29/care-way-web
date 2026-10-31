import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeightRecord } from './weight-record';

describe('WeightRecord', () => {
  let component: WeightRecord;
  let fixture: ComponentFixture<WeightRecord>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeightRecord]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeightRecord);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
