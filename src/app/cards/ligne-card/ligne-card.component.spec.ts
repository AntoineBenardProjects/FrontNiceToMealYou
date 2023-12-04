import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LigneCardComponent } from './ligne-card.component';

describe('LigneCardComponent', () => {
  let component: LigneCardComponent;
  let fixture: ComponentFixture<LigneCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LigneCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LigneCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
