import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptProfessionalRequest } from './accept-professional-request';

describe('AcceptProfessionalRequest', () => {
  let component: AcceptProfessionalRequest;
  let fixture: ComponentFixture<AcceptProfessionalRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcceptProfessionalRequest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcceptProfessionalRequest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
