import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalDashboardMore } from './medical-dashboard-more';

describe('MedicalDashboardMore', () => {
  let component: MedicalDashboardMore;
  let fixture: ComponentFixture<MedicalDashboardMore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalDashboardMore]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalDashboardMore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
