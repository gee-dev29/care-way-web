import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalVirtualForm } from './hospital-virtual-form';

describe('HospitalVirtualForm', () => {
  let component: HospitalVirtualForm;
  let fixture: ComponentFixture<HospitalVirtualForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HospitalVirtualForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalVirtualForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
