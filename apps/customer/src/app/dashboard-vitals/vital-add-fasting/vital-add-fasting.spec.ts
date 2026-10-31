import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VitalAddFasting } from './vital-add-fasting';

describe('VitalAddFasting', () => {
  let component: VitalAddFasting;
  let fixture: ComponentFixture<VitalAddFasting>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VitalAddFasting]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VitalAddFasting);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
