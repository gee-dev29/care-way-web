import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMemberCard } from './add-member-card';

describe('AddMemberCard', () => {
  let component: AddMemberCard;
  let fixture: ComponentFixture<AddMemberCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMemberCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMemberCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
