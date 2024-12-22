import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeBackgroundButtonsComponent } from './change-background-buttons.component';

describe('ChangeBackgroundButtonsComponent', () => {
  let component: ChangeBackgroundButtonsComponent;
  let fixture: ComponentFixture<ChangeBackgroundButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeBackgroundButtonsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeBackgroundButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
