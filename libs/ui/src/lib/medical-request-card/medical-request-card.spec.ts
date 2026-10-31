import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalRequestCard } from './medical-request-card';

describe('MedicalRequestCard', () => {
  let component: MedicalRequestCard;
  let fixture: ComponentFixture<MedicalRequestCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalRequestCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalRequestCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
