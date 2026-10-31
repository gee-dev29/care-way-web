import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAllRadiologyCentreServiceRequests } from './list-all-radiology-centre-service-requests';

describe('ListAllRadiologyCentreServiceRequests', () => {
  let component: ListAllRadiologyCentreServiceRequests;
  let fixture: ComponentFixture<ListAllRadiologyCentreServiceRequests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAllRadiologyCentreServiceRequests]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAllRadiologyCentreServiceRequests);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
