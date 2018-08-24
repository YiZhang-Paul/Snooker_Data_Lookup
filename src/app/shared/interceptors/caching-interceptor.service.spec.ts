import { TestBed, inject } from '@angular/core/testing';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DataCacheService } from '../services/data-cache.service';
import { CachingInterceptorService } from './caching-interceptor.service';

describe('CachingInterceptorService', () => {

    let dataCache: jasmine.SpyObj<DataCacheService>;
    let httpTestingController: HttpTestingController;
    let httpClient: HttpClient;
    const url = '/test-url';
    const liveData = 'data-from-server';
    const cachedData = 'cached-data';

    beforeEach(() => {

        dataCache = jasmine.createSpyObj('DataCacheService', ['set', 'get']);

        TestBed.configureTestingModule({

            imports: [HttpClientTestingModule],
            providers: [

                { provide: DataCacheService, useValue: dataCache },
                { provide: HTTP_INTERCEPTORS, useClass: CachingInterceptorService, multi: true }
            ]
        });

        httpTestingController = TestBed.get(HttpTestingController);
        httpClient = TestBed.get(HttpClient);
    });

    afterEach(() => {

        httpTestingController.verify();
    });

    it('should be created', inject([CachingInterceptorService], (service: CachingInterceptorService) => {

        expect(service).toBeTruthy();
    }));

    it('new request should hit real server and have response cached', () => {

        dataCache.get.and.returnValue(null);

        httpClient.get(url).subscribe(data => {

            expect(data).toEqual(liveData);
        });

        httpTestingController.expectOne(url).flush(liveData);
    });

    it('cached request should not hit real server and have cached response returned', () => {

        dataCache.get.and.returnValue(cachedData);

        httpClient.get(url).subscribe(data => {

            expect(data).toEqual(cachedData);
        });

        httpTestingController.expectNone(url);
    });
});
