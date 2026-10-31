import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VitalsAddHeight } from './vitals-add-height';

describe('VitalsAddHeight', () => {
  let component: VitalsAddHeight;
  let fixture: ComponentFixture<VitalsAddHeight>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VitalsAddHeight]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VitalsAddHeight);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
