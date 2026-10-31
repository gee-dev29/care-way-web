import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddsDetails } from './adds-details';

describe('AddsDetails', () => {
  let component: AddsDetails;
  let fixture: ComponentFixture<AddsDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddsDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddsDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
