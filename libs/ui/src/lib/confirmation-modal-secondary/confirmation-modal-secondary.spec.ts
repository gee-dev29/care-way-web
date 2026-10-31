import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationModalSecondary } from './confirmation-modal-secondary';

describe('ConfirmationModalSecondary', () => {
  let component: ConfirmationModalSecondary;
  let fixture: ComponentFixture<ConfirmationModalSecondary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationModalSecondary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmationModalSecondary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
