import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceRequestDetailsCard } from './service-request-details-card';

describe('ServiceRequestDetailsCard', () => {
  let component: ServiceRequestDetailsCard;
  let fixture: ComponentFixture<ServiceRequestDetailsCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceRequestDetailsCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceRequestDetailsCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
