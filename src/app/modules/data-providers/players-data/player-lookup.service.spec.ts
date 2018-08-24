import { TestBed, inject } from '@angular/core/testing';
import { of } from 'rxjs';
import { IPlayer } from './player.interface';
import { LivePlayerFetcherService } from './live-player-fetcher.service';
import { PlayerLookupService } from './player-lookup.service';

describe('PlayerLookupService', () => {

    const players: IPlayer[] = [

        {
            id: 207,
            firstName: 'John',
            middleName: 'M',
            lastName: 'Doe',
            shortName: 'John Doe',
            dateOfBirth: '1992-03-01',
            sex: 'M',
            nationality: 'three-body',
            photo: '',
            bioPage: '',
            website: '',
            twitter: '',
            turnedPro: 2016,
            lastSeasonPlayed: 2018
        },
        {
            id: 53,
            firstName: 'Jane',
            middleName: '',
            lastName: 'Doe',
            shortName: 'Jane Doe',
            dateOfBirth: '',
            sex: 'F',
            nationality: 'three-body',
            photo: '',
            bioPage: '',
            website: '',
            twitter: '',
            turnedPro: 2013,
            lastSeasonPlayed: 2017
        }
    ];

    const targetYear = 2017;
    const targetPlayer = players[1];
    let fetcher: jasmine.SpyObj<LivePlayerFetcherService>;
    let fetchByIdSpy: jasmine.Spy;
    let fetchByYearSpy: jasmine.Spy;
    let lookup: PlayerLookupService;

    beforeEach(() => {

        setupFetcher(targetPlayer, players);

        TestBed.configureTestingModule({

            providers: [

                PlayerLookupService,
                { provide: LivePlayerFetcherService, useValue: fetcher }
            ]
        });

        lookup = TestBed.get(PlayerLookupService);
    });

    it('should be created', inject([PlayerLookupService], (service: PlayerLookupService) => {

        expect(service).toBeTruthy();
    }));

    it('getPlayer() should fetch player from server upon new request', () => {

        lookup.getPlayer(targetPlayer.id).subscribe(data => {

            expect(data).toEqual(targetPlayer);
        });

        expect(fetchByIdSpy).toHaveBeenCalledTimes(1);
    });

    it('getPlayer() should cache player data and return cached data on same request', () => {

        lookup.getPlayer(targetPlayer.id).subscribe(data => {

            expect(data).toEqual(targetPlayer);

            lookup.getPlayer(targetPlayer.id).subscribe(cachedData => {

                expect(cachedData).toEqual(data);
            });
        });
        // no more subsequent requests after the first request
        expect(fetchByIdSpy).toHaveBeenCalledTimes(1);
    });

    it('getPlayer() should not cache null value returned by server', () => {

        fetchByIdSpy = fetcher.fetchById.and.returnValue(of(null));

        lookup.getPlayer(targetPlayer.id).subscribe(() => {

            lookup.getPlayer(targetPlayer.id).subscribe();
        });

        expect(fetchByIdSpy).toHaveBeenCalledTimes(2);
    });

    it('getPlayer() should return observable of null when failed to retrieve new data', () => {

        fetchByIdSpy = fetcher.fetchById.and.returnValue(of(null));

        lookup.getPlayer(targetPlayer.id).subscribe(data => {

            expect(data).toBeNull();
        });

        expect(fetchByIdSpy).toHaveBeenCalledTimes(1);
    });

    it('getPlayers() should fetch players from server upon request', () => {

        lookup.getPlayers(targetYear).subscribe(data => {

            expect(data.size).toEqual(players.length);

            players.forEach(player => {

                expect(data.get(player.id)).toEqual(player);
            });
        });

        expect(fetchByYearSpy).toHaveBeenCalledTimes(1);
    });

    it('getPlayers() should cache players data and return cached data on same request', () => {

        lookup.getPlayers(targetYear).subscribe(data => {

            expect(data.size).toEqual(players.length);
            expect(data.get(targetPlayer.id)).toEqual(targetPlayer);

            lookup.getPlayers(targetYear).subscribe(cachedData => {

                expect(cachedData).toEqual(data);
            });
        });
        // no more subsequent requests after the first request
        expect(fetchByYearSpy).toHaveBeenCalledTimes(1);
    });

    it('getPlayers() should make cached data available for individual lookup by id in the future', () => {

        lookup.getPlayers(targetYear).subscribe(data => {

            data.forEach(player => {

                lookup.getPlayer(player.id).subscribe(cachedData => {

                    expect(cachedData).toEqual(player);
                });
            });
        });

        expect(fetchByIdSpy).toHaveBeenCalledTimes(0);
        expect(fetchByYearSpy).toHaveBeenCalledTimes(1);
    });

    it('getPlayers() should return observable of null when failed to retrieve data', () => {

        fetchByYearSpy = fetcher.fetchByYear.and.returnValue(of(null));

        lookup.getPlayers(targetYear).subscribe(data => {

            expect(data).toBeNull();
        });

        expect(fetchByYearSpy).toHaveBeenCalledTimes(1);
    });

    function setupFetcher(responseById: IPlayer = null, responseByYear: IPlayer[] = null): void {

        const methods = ['fetchById', 'fetchByYear'];
        fetcher = jasmine.createSpyObj('LivePlayerFetcherService', methods);
        fetchByIdSpy = fetcher.fetchById.and.returnValue(of(responseById));
        fetchByYearSpy = fetcher.fetchByYear.and.returnValue(of(responseByYear));
    }
});
