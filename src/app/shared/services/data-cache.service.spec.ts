import { TestBed, inject } from '@angular/core/testing';
import { fakeRequest, fakeResponse } from '../../../testing/custom-test-utilities';
import { DataCacheService } from './data-cache.service';

describe('DataCacheService', () => {

    const request = fakeRequest('request-url');
    const response = fakeResponse('response-text');
    let dataCache: DataCacheService;

    beforeEach(() => {

        TestBed.configureTestingModule({

            providers: [DataCacheService]
        });

        dataCache = TestBed.get(DataCacheService);
    });

    it('should be created', inject([DataCacheService], (service: DataCacheService) => {

        expect(service).toBeTruthy();
    }));

    it('should cache new requests with corresponding responses', () => {

        const anotherRequest = fakeRequest('another-request-url');
        const totalCached = dataCache.totalCached;

        dataCache.set(request, response);
        expect(dataCache.totalCached).toEqual(totalCached + 1);

        dataCache.set(anotherRequest, response);
        expect(dataCache.totalCached).toEqual(totalCached + 2);
    });

    it('should not cache duplicated requests', () => {

        const totalCached = dataCache.totalCached;

        dataCache.set(request, response);
        expect(dataCache.totalCached).toEqual(totalCached + 1);

        dataCache.set(request, response);
        expect(dataCache.totalCached).toEqual(totalCached + 1);
    });

    it('should return null when no cached response is found', () => {

        expect(dataCache.get(request)).toBeNull();
    });

    it('should return cached response when possible', () => {

        dataCache.set(request, response);

        expect(dataCache.get(request)).toEqual(response);
    });

    it('should delete expired cache', () => {

        const totalCached = dataCache.totalCached;

        dataCache.set(request, response);
        expect(dataCache.totalCached).toEqual(totalCached + 1);

        jasmine.clock().install();
        jasmine.clock().mockDate(new Date());
        jasmine.clock().tick(dataCache.lifeTime + 1000);
        // * requesting expired cached data will cause data to be removed
        expect(dataCache.get(request)).toBeNull();
        expect(dataCache.totalCached).toEqual(totalCached);

        jasmine.clock().uninstall();
    });
});
