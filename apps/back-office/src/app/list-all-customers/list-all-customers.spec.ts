import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAllCustomers } from './list-all-customers';

describe('ListAllCustomers', () => {
  let component: ListAllCustomers;
  let fixture: ComponentFixture<ListAllCustomers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAllCustomers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAllCustomers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
