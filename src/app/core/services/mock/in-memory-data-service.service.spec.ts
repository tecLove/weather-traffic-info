import { TestBed } from '@angular/core/testing';

import { InMemoryDataService } from './in-memory-data-service.service';

let service: InMemoryDataService;
describe('InMemoryDataServiceService', () => {
  beforeEach( () => {
    TestBed.configureTestingModule({
  });
    service = TestBed.inject(InMemoryDataService);
  }
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should create inMemory DB', () => {
    const result = service.createDb();
    expect(result.forms[0].id).toEqual(1);
  });
});
