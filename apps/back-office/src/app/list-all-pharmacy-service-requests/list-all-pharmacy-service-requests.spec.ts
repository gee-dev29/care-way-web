import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAllPharmacyServiceRequests } from './list-all-pharmacy-service-requests';

describe('ListAllPharmacyServiceRequests', () => {
  let component: ListAllPharmacyServiceRequests;
  let fixture: ComponentFixture<ListAllPharmacyServiceRequests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAllPharmacyServiceRequests]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAllPharmacyServiceRequests);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
