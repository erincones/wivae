import { TestBed } from '@angular/core/testing';

import { GUIService } from './gui.service';

describe('GUIService', () => {
  let service: GUIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GUIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
