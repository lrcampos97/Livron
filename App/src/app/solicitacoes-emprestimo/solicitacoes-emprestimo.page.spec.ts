import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitacoesEmprestimoPage } from './solicitacoes-emprestimo.page';

describe('SolicitacoesEmprestimoPage', () => {
  let component: SolicitacoesEmprestimoPage;
  let fixture: ComponentFixture<SolicitacoesEmprestimoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitacoesEmprestimoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitacoesEmprestimoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
