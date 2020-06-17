import { TestBed } from '@angular/core/testing';

import { UsuarioLivrosService } from './usuario-livros.service';

describe('UsuarioLivrosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UsuarioLivrosService = TestBed.get(UsuarioLivrosService);
    expect(service).toBeTruthy();
  });
});
