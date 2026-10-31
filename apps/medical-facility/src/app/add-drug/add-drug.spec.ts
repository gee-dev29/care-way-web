import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDrug } from './add-drug';

describe('AddDrug', () => {
  let component: AddDrug;
  let fixture: ComponentFixture<AddDrug>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDrug]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDrug);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
