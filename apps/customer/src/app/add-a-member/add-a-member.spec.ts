import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAMember } from './add-a-member';

describe('AddAMember', () => {
  let component: AddAMember;
  let fixture: ComponentFixture<AddAMember>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAMember]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAMember);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
