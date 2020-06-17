import { TestBed } from '@angular/core/testing';

import { ParamDataService } from './param-data.service';

describe('ParamDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ParamDataService = TestBed.get(ParamDataService);
    expect(service).toBeTruthy();
  });
});
