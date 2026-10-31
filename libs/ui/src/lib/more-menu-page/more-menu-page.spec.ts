import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreMenuPage } from './more-menu-page';

describe('MoreMenuPage', () => {
  let component: MoreMenuPage;
  let fixture: ComponentFixture<MoreMenuPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoreMenuPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoreMenuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
