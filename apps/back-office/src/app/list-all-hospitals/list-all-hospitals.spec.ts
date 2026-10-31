import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAllHospitals } from './list-all-hospitals';

describe('ListAllHospitals', () => {
  let component: ListAllHospitals;
  let fixture: ComponentFixture<ListAllHospitals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAllHospitals]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAllHospitals);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
