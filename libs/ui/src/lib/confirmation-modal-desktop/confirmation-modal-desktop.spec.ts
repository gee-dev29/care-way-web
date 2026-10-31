import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationModalDesktop } from './confirmation-modal-desktop';

describe('ConfirmationModalDesktop', () => {
  let component: ConfirmationModalDesktop;
  let fixture: ComponentFixture<ConfirmationModalDesktop>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationModalDesktop]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmationModalDesktop);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
