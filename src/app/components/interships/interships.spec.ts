import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Interships } from './interships';

describe('Interships', () => {
  let component: Interships;
  let fixture: ComponentFixture<Interships>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Interships]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Interships);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
