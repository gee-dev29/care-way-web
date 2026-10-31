import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeightRecord } from './height-record';

describe('HeightRecord', () => {
  let component: HeightRecord;
  let fixture: ComponentFixture<HeightRecord>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeightRecord]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeightRecord);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
