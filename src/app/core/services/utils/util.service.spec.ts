import { TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { UtilService } from './util.service';

// tslint:disable-next-line:max-line-length
describe('UtilService', () => {
  let service: UtilService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule
      ],
      declarations: [],
      providers: [UtilService]
    });
    service = TestBed.inject(UtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should call storage methods', () => {
    expect(service.windowLocation).toEqual(window.location);
    expect(service.sessionStorage).toEqual(window.sessionStorage);
    expect(service.localStorage).toEqual(window.localStorage);
    expect(service.cookie).toEqual(document.cookie);
  });
  it('should call handleNumLength method to define the length of form input control', () => {
    expect(service.handleNumLength(new FormControl('123456'), 6)).toEqual(false);
    expect(service.handleNumLength(new FormControl('12345'), 6)).toEqual(true);
    expect(service.handleNumLength(new FormControl(), 6)).toEqual(true);
  });
  it('should call toTitleCase method', () => {
    expect(service.toTitleCase('national environment agency')).toEqual('National Environment Agency');
  });
});
