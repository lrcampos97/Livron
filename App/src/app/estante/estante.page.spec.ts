import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstantePage } from './estante.page';

describe('EstantePage', () => {
  let component: EstantePage;
  let fixture: ComponentFixture<EstantePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstantePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstantePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
