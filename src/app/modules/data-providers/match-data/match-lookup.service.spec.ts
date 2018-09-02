import { TestBed, inject } from '@angular/core/testing';
import { of } from 'rxjs';
import { IMatch } from './match.interface';
import { LiveMatchFetcherService } from './live-match-fetcher.service';
import { MatchLookupService } from './match-lookup.service';

describe('MatchLookupService', () => {

    const matches = <IMatch[]>[

        {
            matchId: 3420410,
            player1: 1,
            score1: 4,
            player2: 6,
            score2: 1
        }
    ];

    const playerId = 1;
    const year = 2015;
    let fetcher: jasmine.SpyObj<LiveMatchFetcherService>;
    let fetchByPlayerSpy: jasmine.Spy;
    let lookup: MatchLookupService;

    beforeEach(() => {

        setupFetcher(matches);

        TestBed.configureTestingModule({

            providers: [

                MatchLookupService,
                { provide: LiveMatchFetcherService, useValue: fetcher }
            ]
        });

        lookup = TestBed.get(MatchLookupService);
    });

    it('should be created', inject([MatchLookupService], (service: MatchLookupService) => {

        expect(service).toBeTruthy();
    }));

    it('getMatchesOfPlayer() should fetch match data from server upon new request', () => {

        lookup.getMatchesOfPlayer(playerId, year).subscribe(data => {

            expect(data).toEqual(matches);
        });

        expect(fetchByPlayerSpy).toHaveBeenCalledTimes(1);
    });

    it('getMatchesOfPlayer() should cache match data and return cached data on same request', () => {

        lookup.getMatchesOfPlayer(playerId, year).subscribe(data => {

            expect(data).toEqual(matches);

            lookup.getMatchesOfPlayer(playerId, year).subscribe(cachedData => {

                expect(cachedData).toEqual(data);
            });
        });
        // no more subsequent requests after the first request
        expect(fetchByPlayerSpy).toHaveBeenCalledTimes(1);
    });

    it('getMatchesOfPlayer() should not cache null value returned by server', () => {

        fetchByPlayerSpy = fetcher.fetchByPlayer.and.returnValue(of(null));

        lookup.getMatchesOfPlayer(playerId, year).subscribe(() => {

            lookup.getMatchesOfPlayer(playerId, year).subscribe();
        });

        expect(fetchByPlayerSpy).toHaveBeenCalledTimes(2);
    });

    it('getMatchesOfPlayer() should return observable of null when failed to retrieve new data', () => {

        fetchByPlayerSpy = fetcher.fetchByPlayer.and.returnValue(of(null));

        lookup.getMatchesOfPlayer(playerId, year).subscribe(data => {

            expect(data).toBeNull();
        });

        expect(fetchByPlayerSpy).toHaveBeenCalledTimes(1);
    });

    function setupFetcher(response: IMatch[]): void {

        fetcher = jasmine.createSpyObj('LiveMatchFetcherService', ['fetchByPlayer']);
        fetchByPlayerSpy = fetcher.fetchByPlayer.and.returnValue(of(response));
    }
});
