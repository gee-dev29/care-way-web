import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRadiologist } from './add-radiologist';

describe('AddRadiologist', () => {
  let component: AddRadiologist;
  let fixture: ComponentFixture<AddRadiologist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRadiologist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRadiologist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
