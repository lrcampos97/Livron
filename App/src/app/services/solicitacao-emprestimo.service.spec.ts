import { TestBed } from '@angular/core/testing';

import { SolicitacaoEmprestimoService } from './solicitacao-emprestimo.service';

describe('SolicitacaoEmprestimoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SolicitacaoEmprestimoService = TestBed.get(SolicitacaoEmprestimoService);
    expect(service).toBeTruthy();
  });
});
