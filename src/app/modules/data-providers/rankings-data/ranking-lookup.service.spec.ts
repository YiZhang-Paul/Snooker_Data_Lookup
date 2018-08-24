import { TestBed, inject } from '@angular/core/testing';
import { of } from 'rxjs';
import { IRankData } from './rank-data.interface';
import { LiveRankingFetcherService } from './live-ranking-fetcher.service';
import { RankingLookupService } from './ranking-lookup.service';

describe('RankingLookupService', () => {

    let fetcher: jasmine.SpyObj<LiveRankingFetcherService>;
    let fetchSpy: jasmine.Spy;
    let lookup: RankingLookupService;
    const year = 2018;

    const rankData: IRankData[] = [

        { position: 1, playerId: 1, earnings: 150, type: 'MoneyRankings'},
        { position: 2, playerId: 2, earnings: 350, type: 'MoneyRankings'},
    ];

    beforeEach(() => {

        setupFetcher(rankData);

        TestBed.configureTestingModule({

            providers: [

                RankingLookupService,
                { provide: LiveRankingFetcherService, useValue: fetcher }
            ]
        });

        lookup = TestBed.get(RankingLookupService);
    });

    it('should be created', inject([RankingLookupService], (service: RankingLookupService) => {

        expect(service).toBeTruthy();
    }));

    it('should fetch data from server upon new request', () => {

        lookup.getRankings(year).subscribe(data => {

            expect(data).toEqual(rankData);
        });

        expect(fetchSpy).toHaveBeenCalledTimes(1);
    });

    it('should cache data and return cached data when possible', () => {

        lookup.getRankings(year).subscribe(data => {

            expect(data).toEqual(rankData);

            lookup.getRankings(year).subscribe(cachedData => {

                expect(cachedData).toEqual(data);
            });
        });
        // no more subsequent requests after the first request
        expect(fetchSpy).toHaveBeenCalledTimes(1);
    });

    it('should not cache data when fetcher returns observable of null', () => {

        fetcher.fetch.and.returnValue(of(null));

        lookup.getRankings(year).subscribe(() => {

            lookup.getRankings(year).subscribe();
        });

        expect(fetchSpy).toHaveBeenCalledTimes(2);
    });

    function setupFetcher(response: IRankData[]): void {

        fetcher = jasmine.createSpyObj('LiveRankingFetcherService', ['fetch']);
        fetchSpy = fetcher.fetch.and.returnValue(of(response));
    }
});
