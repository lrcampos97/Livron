import { TestBed } from '@angular/core/testing';

import { EmprestimosService } from './emprestimos.service';

describe('EmprestimosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EmprestimosService = TestBed.get(EmprestimosService);
    expect(service).toBeTruthy();
  });
});
