import { TestBed } from '@angular/core/testing';

import { UsuarioAmigosService } from './usuario-amigos.service';

describe('UsuarioAmigosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UsuarioAmigosService = TestBed.get(UsuarioAmigosService);
    expect(service).toBeTruthy();
  });
});
