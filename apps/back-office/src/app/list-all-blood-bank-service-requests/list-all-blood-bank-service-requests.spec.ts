import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAllBloodBankServiceRequests } from './list-all-blood-bank-service-requests';

describe('ListAllBloodBankServiceRequests', () => {
  let component: ListAllBloodBankServiceRequests;
  let fixture: ComponentFixture<ListAllBloodBankServiceRequests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAllBloodBankServiceRequests]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAllBloodBankServiceRequests);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
