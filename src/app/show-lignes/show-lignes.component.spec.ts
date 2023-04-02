import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowLignesComponent } from './show-lignes.component';

describe('ShowLignesComponent', () => {
  let component: ShowLignesComponent;
  let fixture: ComponentFixture<ShowLignesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowLignesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowLignesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
