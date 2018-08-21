import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IRankItem } from './rank-item.interface';
import { LiveRankingFetcherService } from './live-ranking-fetcher.service';

describe('LiveRankingFetcherService', () => {

    let httpTestingController: HttpTestingController;
    let fetcher: LiveRankingFetcherService;
    const url = 'http://api.snooker.org/?rt=MoneyRankings&s=2015';

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

        const rawData: object[] = [{ Position: 1, PlayerID: 1, Sum: 1, Type: 'MoneyRankings' }];
        const response: IRankItem[] = [{ position: 1, playerId: 1, earnings: 1, type: 'MoneyRankings' }];

        fetcher.fetch(2015, 'MoneyRankings').subscribe(data => {

            expect(JSON.stringify(data)).toEqual(JSON.stringify(response));
        });

        httpTestingController.expectOne(url).flush(rawData);
    });

    it('should retry 2 times before returning null on failure', () => {

        const totalRetries = 2;

        fetcher.fetch(2015, 'MoneyRankings').subscribe(data => {

            expect(data).toBeNull();
        });

        for (let i = 0; i < totalRetries + 1; i++) {

            httpTestingController.expectOne(url).error(null);
        }
    });
});
