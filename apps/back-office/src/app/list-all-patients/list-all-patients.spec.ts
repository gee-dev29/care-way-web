import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAllPatients } from './list-all-patients';

describe('ListAllPatients', () => {
  let component: ListAllPatients;
  let fixture: ComponentFixture<ListAllPatients>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAllPatients]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAllPatients);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
