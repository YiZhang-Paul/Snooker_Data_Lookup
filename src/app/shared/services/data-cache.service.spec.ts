import { TestBed, inject } from '@angular/core/testing';
import { HttpRequest, HttpResponse } from '@angular/common/http';
import { DataCacheService } from './data-cache.service';

describe('DataCacheService', () => {

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

    it('should cache new requests with their responses', () => {

        const request = createRequest('request-url');
        const anotherRequest = createRequest('another-request-url');
        const response = createResponse('response-text');
        const totalCached = dataCache.totalCached;

        dataCache.set(request, response);
        expect(dataCache.totalCached).toEqual(totalCached + 1);

        dataCache.set(anotherRequest, response);
        expect(dataCache.totalCached).toEqual(totalCached + 2);
    });

    it('should not cache duplicated requests', () => {

        const sameRequest = createRequest('request-url');
        const response = createResponse('response-text');
        const totalCached = dataCache.totalCached;

        dataCache.set(sameRequest, response);
        expect(dataCache.totalCached).toEqual(totalCached + 1);

        dataCache.set(sameRequest, response);
        expect(dataCache.totalCached).toEqual(totalCached + 1);
    });

    it('should return cached response when possible', () => {

        const request = createRequest('request-url');
        const response = createResponse('response-text');

        dataCache.set(request, response);

        expect(dataCache.get(request).body).toEqual(response.body);
    });

    it('should return null when no cached response is found', () => {

        const request = createRequest('request-url');

        expect(dataCache.get(request)).toBeNull();
    });

    it('should delete expired cache', () => {

        const request = createRequest('request-url');
        const response = createResponse('response-text');
        const totalCached = dataCache.totalCached;

        dataCache.set(request, response);
        expect(dataCache.get(request)).not.toBeNull();
        expect(dataCache.totalCached).toEqual(totalCached + 1);

        jasmine.clock().install();
        jasmine.clock().mockDate(new Date());
        jasmine.clock().tick(dataCache.lifeTime + 1000);

        expect(dataCache.get(request)).toBeNull();
        expect(dataCache.totalCached).toEqual(totalCached);

        jasmine.clock().uninstall();
    });
});

function createRequest(url: string, method: string = 'GET'): HttpRequest<any> {

    return new HttpRequest<any>('GET', url);
}

function createResponse(body: string): HttpResponse<any> {

    return new HttpResponse({ body });
}
