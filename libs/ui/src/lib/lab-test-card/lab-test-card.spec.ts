import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabTestCard } from './lab-test-card';

describe('LabTestCard', () => {
  let component: LabTestCard;
  let fixture: ComponentFixture<LabTestCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabTestCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabTestCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
