import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewMember } from './add-new-member';

describe('AddNewMember', () => {
  let component: AddNewMember;
  let fixture: ComponentFixture<AddNewMember>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewMember]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewMember);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
