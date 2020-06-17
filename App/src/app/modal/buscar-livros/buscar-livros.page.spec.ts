import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarLivrosPage } from './buscar-livros.page';

describe('BuscarLivrosPage', () => {
  let component: BuscarLivrosPage;
  let fixture: ComponentFixture<BuscarLivrosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuscarLivrosPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscarLivrosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
