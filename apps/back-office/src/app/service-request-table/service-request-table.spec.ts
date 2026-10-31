import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceRequestTable } from './service-request-table';

describe('ServiceRequestTable', () => {
  let component: ServiceRequestTable;
  let fixture: ComponentFixture<ServiceRequestTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceRequestTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceRequestTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
