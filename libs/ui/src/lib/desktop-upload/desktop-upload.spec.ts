import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopUpload } from './desktop-upload';

describe('DesktopUpload', () => {
  let component: DesktopUpload;
  let fixture: ComponentFixture<DesktopUpload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesktopUpload]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesktopUpload);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
