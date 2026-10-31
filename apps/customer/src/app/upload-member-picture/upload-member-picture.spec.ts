import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadMemberPicture } from './upload-member-picture';

describe('UploadMemberPicture', () => {
  let component: UploadMemberPicture;
  let fixture: ComponentFixture<UploadMemberPicture>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadMemberPicture]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadMemberPicture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
