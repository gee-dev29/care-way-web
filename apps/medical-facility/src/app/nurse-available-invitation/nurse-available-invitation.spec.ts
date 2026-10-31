import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NurseAvailableInvitation } from './nurse-available-invitation';

describe('NurseAvailableInvitation', () => {
  let component: NurseAvailableInvitation;
  let fixture: ComponentFixture<NurseAvailableInvitation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NurseAvailableInvitation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NurseAvailableInvitation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
