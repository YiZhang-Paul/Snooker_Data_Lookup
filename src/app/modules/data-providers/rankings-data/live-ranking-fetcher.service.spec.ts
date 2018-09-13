import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IRankData } from './rank-data.interface';
import { LiveRankingFetcherService } from './live-ranking-fetcher.service';

describe('LiveRankingFetcherService', () => {

    let httpTestingController: HttpTestingController;
    let fetcher: LiveRankingFetcherService;
    const year = 2015;
    const rawData: object[] = [{ Position: 1, PlayerID: 1, Sum: 1, Type: 'MoneyRankings' }];
    const response: IRankData[] = [{ position: 1, playerId: 1, earnings: 1, type: 'MoneyRankings' }];
    const url = `http://api.snooker.org/?rt=MoneyRankings&s=${year}`;

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

    it('should return rank items response on success', () => {

        fetcher.fetch(year, 'MoneyRankings').subscribe(data => {

            expect(JSON.stringify(data)).toEqual(JSON.stringify(response));
        });

        httpTestingController.expectOne(url).flush(rawData);
    });

    it('should retry 2 times before returning null on failure', () => {

        fetcher.fetch(year, 'MoneyRankings').subscribe(data => {

            expect(data).toBeNull();
        });

        for (let retries = 2, i = 0; i < retries + 1; i++) {

            httpTestingController.expectOne(url).error(null);
        }
    });
});
