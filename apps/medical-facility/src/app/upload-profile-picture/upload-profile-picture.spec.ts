import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadProfilePicture } from './upload-profile-picture';

describe('UploadProfilePicture', () => {
  let component: UploadProfilePicture;
  let fixture: ComponentFixture<UploadProfilePicture>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadProfilePicture]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadProfilePicture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
