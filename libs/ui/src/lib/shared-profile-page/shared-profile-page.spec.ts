import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedProfilePage } from './shared-profile-page';

describe('SharedProfilePage', () => {
  let component: SharedProfilePage;
  let fixture: ComponentFixture<SharedProfilePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedProfilePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
