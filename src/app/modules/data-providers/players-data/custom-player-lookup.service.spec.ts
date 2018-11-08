import { TestBed, inject } from '@angular/core/testing';
import { of } from 'rxjs';
import { IPlayer } from './player.interface';
import { CustomLivePlayerFetcherService } from './custom-live-player-fetcher.service';
import { CustomPlayerLookupService } from './custom-player-lookup.service';

describe('CustomPlayerLookupService', () => {

    const players = <IPlayer[]>[

        {
            id: 207,
            shortName: 'John Doe',
            nationality: 'three-body',
            turnedPro: 2016,
            lastSeasonPlayed: 2018
        },
        {
            id: 53,
            shortName: 'Jane Doe',
            nationality: 'three-body',
            turnedPro: 2013,
            lastSeasonPlayed: 2017
        },
        {
            id: 251,
            shortName: 'Larry Moe',
            nationality: 'three-body',
            turnedPro: 2015,
            lastSeasonPlayed: 2018
        }
    ];

    const targetYear = 2017;
    const targetPlayer = players[1];
    let fetcher: jasmine.SpyObj<CustomLivePlayerFetcherService>;
    let fetchByIdSpy: jasmine.Spy;
    let fetchByYearSpy: jasmine.Spy;
    let fetchAllSpy: jasmine.Spy;
    let lookup: CustomPlayerLookupService;

    describe('with cached data', () => {

        beforeEach(() => {

            setupFetcher(targetPlayer, players.slice(1), players);

            TestBed.configureTestingModule({

                providers: [

                    CustomPlayerLookupService,
                    { provide: CustomLivePlayerFetcherService, useValue: fetcher }
                ]
            });

            lookup = TestBed.get(CustomPlayerLookupService);
        });

        it('should be created', inject([CustomPlayerLookupService], (service: CustomPlayerLookupService) => {

            expect(service).toBeTruthy();
        }));

        it('should fetch all players on initialization', () => {

            expect(fetchAllSpy).toHaveBeenCalledTimes(1);
        });

        it('should cache all players', () => {

            lookup.players$.subscribe(data => {

                expect(data.size).toEqual(players.length);
                expect(players.every(player => data.has(player.id))).toBeTruthy();
            });
        });

        it('getPlayer() should return cached data when possible', () => {

            lookup.players$.subscribe(() => {

                lookup.getPlayer(targetPlayer.id).subscribe(data => {

                    expect(data).toEqual(targetPlayer);
                });
            });
            // should not send request to live server
            expect(fetchByIdSpy).toHaveBeenCalledTimes(0);
        });

        it('getPlayers() should cache data and return cached data when possible', () => {

            lookup.getPlayers(targetYear).subscribe(data => {

                lookup.getPlayers(targetYear).subscribe(cachedData => {

                    expect(cachedData).toEqual(data);
                });
            });
            // should not send subsequent request to live server
            expect(fetchByYearSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('without cached data', () => {

        beforeEach(() => {

            setupFetcher(targetPlayer, players.slice(1), null);

            TestBed.configureTestingModule({

                providers: [

                    CustomPlayerLookupService,
                    { provide: CustomLivePlayerFetcherService, useValue: fetcher }
                ]
            });

            lookup = TestBed.get(CustomPlayerLookupService);
        });

        it('getPlayer() should fetch player from server if no cached data is available', () => {

            lookup.getPlayer(targetPlayer.id).subscribe(data => {

                expect(data).toEqual(targetPlayer);
            });

            expect(fetchByIdSpy).toHaveBeenCalledTimes(1);
        });

        it('getPlayer() should return observable of null when failed to retrieve new data', () => {

            fetchByIdSpy = fetcher.fetchById.and.returnValue(of(null));

            lookup.getPlayer(targetPlayer.id).subscribe(data => {

                expect(data).toBeNull();
            });

            expect(fetchByIdSpy).toHaveBeenCalledTimes(1);
        });

        it('getPlayers() should fetch players from server when no cached data available', () => {

            lookup.getPlayers(targetYear).subscribe(data => {

                expect(data.size).toEqual(players.length - 1);

                players.slice(1).forEach(player => {

                    expect(data.get(player.id)).toEqual(player);
                });
            });

            expect(fetchByYearSpy).toHaveBeenCalledTimes(1);
        });

        it('getPlayers() should return observable of null when failed to retrieve data', () => {

            fetchByYearSpy = fetcher.fetchByYear.and.returnValue(of(null));

            lookup.getPlayers(targetYear).subscribe(data => {

                expect(data).toBeNull();
            });

            expect(fetchByYearSpy).toHaveBeenCalledTimes(1);
        });
    });

    function setupFetcher(

        responseById: IPlayer = null,
        responseByYear: IPlayer[] = null,
        responseAll: IPlayer[] = null

    ): void {

        const methods = ['fetchById', 'fetchByYear', 'fetchAll'];
        fetcher = jasmine.createSpyObj('CustomLivePlayerFetcherService', methods);
        fetchByIdSpy = fetcher.fetchById.and.returnValue(of(responseById));
        fetchByYearSpy = fetcher.fetchByYear.and.returnValue(of(responseByYear));
        fetchAllSpy = fetcher.fetchAll.and.returnValue(of(responseAll));
    }
});
