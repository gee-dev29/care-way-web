import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiologyWithAttachmentAllRequest } from './radiology-with-attachment-all-request';

describe('RadiologyWithAttachmentAllRequest', () => {
  let component: RadiologyWithAttachmentAllRequest;
  let fixture: ComponentFixture<RadiologyWithAttachmentAllRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadiologyWithAttachmentAllRequest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RadiologyWithAttachmentAllRequest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
