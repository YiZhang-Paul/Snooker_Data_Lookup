import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { LiveRankingFetcherService } from './live-ranking-fetcher.service';

describe('LiveRankingFetcherService', () => {

    let httpTestingController: HttpTestingController;
    let fetcher: LiveRankingFetcherService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [LiveRankingFetcherService]
        });

        httpTestingController = TestBed.get(HttpTestingController);
        fetcher = TestBed.get(LiveRankingFetcherService);
    });

    afterEach(() => {

        httpTestingController.verify();
    });

    it('should be created', inject([LiveRankingFetcherService], (service: LiveRankingFetcherService) => {
        expect(service).toBeTruthy();
    }));

    it('should return JSON response on success', () => {

        const response = '{ID: 1, MatchID: 1, Type: "MoneyRankings"}';

        fetcher.fetch(2015, 'MoneyRankings').subscribe(data => {

            expect(data).toEqual(response);
        });

        httpTestingController.expectOne('api.snooker.org/?rt=MoneyRankings&s=2015').flush(response);
    });

    it('should return null on failure', () => {

        fetcher.fetch(2015, 'MoneyRankings').subscribe(data => {

            expect(data).toBeNull();
        });

        httpTestingController.expectOne('api.snooker.org/?rt=MoneyRankings&s=2015').error(null);
    });
});
