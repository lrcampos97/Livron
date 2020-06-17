import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NovoLivroPage } from './novo-livro.page';

describe('NovoLivroPage', () => {
  let component: NovoLivroPage;
  let fixture: ComponentFixture<NovoLivroPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NovoLivroPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NovoLivroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
