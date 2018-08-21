import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DataCacheService } from '../services/data-cache.service';
import { CachingInterceptorService } from './caching-interceptor.service';

describe('CachingInterceptorService', () => {

    let dataCache: jasmine.SpyObj<DataCacheService>;
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {

        dataCache = jasmine.createSpyObj('DataCacheService', ['set', 'get']);

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                { provide: DataCacheService, useValue: dataCache },
                { provide: HTTP_INTERCEPTORS, useClass: CachingInterceptorService, multi: true }
            ]
        });

        httpClient = TestBed.get(HttpClient);
        httpTestingController = TestBed.get(HttpTestingController);
    });

    afterEach(() => {

        httpTestingController.verify();
    });

    it('should be created', inject([CachingInterceptorService], (service: CachingInterceptorService) => {
        expect(service).toBeTruthy();
    }));

    it('new request should hit real server and have response cached', () => {

        const url = '/test-url';
        const dataFromServer = 'data-from-server';
        dataCache.get.and.returnValue(null);

        httpClient.get(url).subscribe(data => {

            expect(data).toEqual(dataFromServer);
        });

        httpTestingController.expectOne(url).flush(dataFromServer);
    });

    it('cached request should not hit real server and have cached response returned', () => {

        const url = '/test-url';
        const cached = 'cached-data';
        dataCache.get.and.returnValue(cached);

        httpClient.get(url).subscribe(data => {

            expect(data).toEqual(cached);
        });

        httpTestingController.expectNone(url);
    });
});
