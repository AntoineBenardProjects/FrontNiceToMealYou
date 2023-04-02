import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowHorairesComponent } from './show-horaires.component';

describe('ShowHorairesComponent', () => {
  let component: ShowHorairesComponent;
  let fixture: ComponentFixture<ShowHorairesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowHorairesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowHorairesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
