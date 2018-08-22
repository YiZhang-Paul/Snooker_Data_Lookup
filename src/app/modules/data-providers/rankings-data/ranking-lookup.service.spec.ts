import { TestBed, inject } from '@angular/core/testing';
import { of } from 'rxjs';
import { IRankData } from './rank-data.interface';
import { LiveRankingFetcherService } from './live-ranking-fetcher.service';
import { RankingLookupService } from './ranking-lookup.service';

describe('RankingLookupService', () => {

    let fetcher: jasmine.SpyObj<LiveRankingFetcherService>;
    let fetchSpy: jasmine.Spy;
    let rankingLookup: RankingLookupService;
    const year = 2018;

    const rankData: IRankData[] = [

        { position: 1, playerId: 1, earnings: 150, type: 'm'},
        { position: 2, playerId: 2, earnings: 350, type: 'm'},
    ];

    beforeEach(() => {

        fetcher = jasmine.createSpyObj('LiveRankingFetcherService', ['fetch']);
        fetchSpy = fetcher.fetch.and.returnValue(of(rankData));

        TestBed.configureTestingModule({
            providers: [
                RankingLookupService,
                { provide: LiveRankingFetcherService, useValue: fetcher }
            ]
        });

        rankingLookup = TestBed.get(RankingLookupService);
    });

    it('should be created', inject([RankingLookupService], (service: RankingLookupService) => {
        expect(service).toBeTruthy();
    }));

    it('should fetch data from server upon new request', () => {

        rankingLookup.getRankings(year).subscribe(data => {

            expect(data).toEqual(rankData);
        });

        expect(fetchSpy.calls.count()).toEqual(1);
    });

    it('should cache data and return cached data when possible', () => {

        rankingLookup.getRankings(year).subscribe(data => {

            expect(data).toEqual(rankData);

            rankingLookup.getRankings(year).subscribe(cachedData => {

                expect(cachedData).toEqual(data);
            });
        });
        // no more subsequent requests after the first request
        expect(fetchSpy.calls.count()).toEqual(1);
    });

    it('should not cache data when fetcher returns observable of null', () => {

        fetcher.fetch.and.returnValue(of(null));

        rankingLookup.getRankings(year).subscribe(() => {

            rankingLookup.getRankings(year).subscribe();
        });

        expect(fetchSpy.calls.count()).toEqual(2);
    });
});
