import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAllLaboratoryServiceRequests } from './list-all-laboratory-service-requests';

describe('ListAllLaboratoryServiceRequests', () => {
  let component: ListAllLaboratoryServiceRequests;
  let fixture: ComponentFixture<ListAllLaboratoryServiceRequests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAllLaboratoryServiceRequests]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAllLaboratoryServiceRequests);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
