import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiologyNoAttachmentAllRequest } from './radiology-no-attachment-all-request';

describe('RadiologyNoAttachmentAllRequest', () => {
  let component: RadiologyNoAttachmentAllRequest;
  let fixture: ComponentFixture<RadiologyNoAttachmentAllRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadiologyNoAttachmentAllRequest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RadiologyNoAttachmentAllRequest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
