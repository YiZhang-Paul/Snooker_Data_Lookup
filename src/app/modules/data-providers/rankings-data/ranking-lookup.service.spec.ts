import { TestBed, inject } from '@angular/core/testing';
import { of } from 'rxjs';
import { IRankData } from './rank-data.interface';
import { LiveRankingFetcherService } from './live-ranking-fetcher.service';
import { RankingLookupService } from './ranking-lookup.service';

describe('RankingLookupService', () => {

    let fetcher: jasmine.SpyObj<LiveRankingFetcherService>;
    let fetchSpy: jasmine.Spy;
    let lookup: RankingLookupService;
    const currentYear = new Date().getFullYear();

    const rankData: { [year: number]: IRankData[] } = {

        [currentYear - 2]: [

            { position: 1, playerId: 1, earnings: 150, type: 'MoneyRankings'}
        ],
        [currentYear - 1]: [

            { position: 1, playerId: 1, earnings: 250, type: 'MoneyRankings'},
            { position: 2, playerId: 2, earnings: 50, type: 'MoneyRankings'}
        ],
        [currentYear]: [

            { position: 1, playerId: 2, earnings: 350, type: 'MoneyRankings'},
            { position: 2, playerId: 1, earnings: 300, type: 'MoneyRankings'}
        ]
    };

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

    it('getRankings() should fetch data from server upon new request', () => {

        lookup.getRankings(currentYear).subscribe(data => {

            expect(data).toEqual(rankData[currentYear]);
        });

        expect(fetchSpy).toHaveBeenCalledTimes(1);
    });

    it('getRankings() should cache data and return cached data when possible', () => {

        lookup.getRankings(currentYear).subscribe(data => {

            expect(data).toEqual(rankData[currentYear]);

            lookup.getRankings(currentYear).subscribe(cachedData => {

                expect(cachedData).toEqual(data);
            });
        });
        // no more subsequent requests after the first request
        expect(fetchSpy).toHaveBeenCalledTimes(1);
    });

    it('getRankings() should not cache data when fetcher returns observable of null', () => {

        fetcher.fetch.and.returnValue(of(null));

        lookup.getRankings(currentYear).subscribe(() => {

            lookup.getRankings(currentYear).subscribe();
        });

        expect(fetchSpy).toHaveBeenCalledTimes(2);
    });

    it('getRankingsSince() should fetch all rankings since specified year', () => {

        lookup.getRankingsSince(currentYear - 2).subscribe(data => {

            expect(data.length).toEqual(3);
            expect(data[0]).toEqual(rankData[currentYear - 2]);
            expect(data[1]).toEqual(rankData[currentYear - 1]);
            expect(data[2]).toEqual(rankData[currentYear]);
        });

        expect(fetchSpy).toHaveBeenCalledTimes(3);
    });

    it('getRankingsSince() should cache all valid rankings retrieved from server', () => {

        lookup.getRankingsSince(currentYear - 2).subscribe(data => {

            lookup.getRankings(currentYear - 2).subscribe();
            lookup.getRankings(currentYear - 1).subscribe();
            lookup.getRankings(currentYear).subscribe();
        });
        // no subsequent requests from getRankings() since they return cached data now
        expect(fetchSpy).toHaveBeenCalledTimes(3);
    });

    it('getRankingsSince() should return null for years during which ranking data is not available', () => {

        lookup.getRankingsSince(currentYear - 4).subscribe(data => {

            expect(data.length).toEqual(5);
            expect(data.filter(ranking => !ranking).length).toEqual(2);
        });

        expect(fetchSpy).toHaveBeenCalledTimes(5);
    });

    function setupFetcher(data: { [year: number]: IRankData[] }): void {

        fetcher = jasmine.createSpyObj('LiveRankingFetcherService', ['fetch']);

        fetchSpy = fetcher.fetch.and.callFake(targetYear => {

            return of(data[targetYear] ? data[targetYear] : null);
        });
    }
});
