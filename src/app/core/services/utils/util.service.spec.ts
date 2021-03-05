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
  it('should convertToTwoDigit method', () => {
    expect(service.convertToTwoDigit(9)).toEqual(`09`);
    expect(service.convertToTwoDigit(10)).toEqual(10);
  });
  it('should verify getter and setter for loader', () => {
    service.loader.subscribe((res) => {
      expect(res).toEqual(true);
    });
    expect(service.loader).toEqual(service.loader);
    service.toggleLoader = true;
  });
  it('should call curreTimeStamp method', () => {
    let timeStamp = service.curreTimeStamp();
    expect(timeStamp.substr(0, 4)).toEqual('2021');
    timeStamp = service.curreTimeStamp('2021-04-06');
    expect(timeStamp.substr(5, 2)).toEqual('04');
  });
});

