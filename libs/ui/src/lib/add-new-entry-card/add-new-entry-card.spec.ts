import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewEntryCard } from './add-new-entry-card';

describe('AddNewEntryCard', () => {
  let component: AddNewEntryCard;
  let fixture: ComponentFixture<AddNewEntryCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewEntryCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewEntryCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
