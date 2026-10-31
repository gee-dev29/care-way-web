import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideToastr } from 'ngx-toastr';

import { ApprovalButton } from './approval-button';

describe('ApprovalButton', () => {
  let component: ApprovalButton;
  let fixture: ComponentFixture<ApprovalButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovalButton],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideToastr(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ApprovalButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
