import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VitalsAddWeight } from './vitals-add-weight';

describe('VitalsAddWeight', () => {
  let component: VitalsAddWeight;
  let fixture: ComponentFixture<VitalsAddWeight>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VitalsAddWeight]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VitalsAddWeight);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
