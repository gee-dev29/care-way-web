import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlucoseType } from './glucose-type';

describe('GlucoseType', () => {
  let component: GlucoseType;
  let fixture: ComponentFixture<GlucoseType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlucoseType]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlucoseType);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
