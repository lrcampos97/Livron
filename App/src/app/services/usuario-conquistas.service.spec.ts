import { TestBed } from '@angular/core/testing';

import { UsuarioConquistasService } from './usuario-conquistas.service';

describe('UsuarioConquistasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UsuarioConquistasService = TestBed.get(UsuarioConquistasService);
    expect(service).toBeTruthy();
  });
});
