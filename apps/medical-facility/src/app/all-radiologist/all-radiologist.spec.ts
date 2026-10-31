import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllRadiologist } from './all-radiologist';

describe('AllRadiologist', () => {
  let component: AllRadiologist;
  let fixture: ComponentFixture<AllRadiologist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllRadiologist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllRadiologist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
