import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllHelpRequests } from './all-help-requests';

describe('AllHelpRequests', () => {
  let component: AllHelpRequests;
  let fixture: ComponentFixture<AllHelpRequests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllHelpRequests]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllHelpRequests);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
