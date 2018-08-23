import { TestBed, inject } from '@angular/core/testing';
import { of } from 'rxjs';
import { IPlayer } from './player.interface';
import { LivePlayerFetcherService } from './live-player-fetcher.service';
import { PlayerLookupService } from './player-lookup.service';

describe('PlayerLookupService', () => {

    const playerOne: IPlayer = {

        id: 207,
        firstName: '',
        middleName: '',
        lastName: '',
        shortName: 'John Doe',
        dateOfBirth: '',
        sex: '',
        nationality: 'three-body',
        photo: '',
        bioPage: '',
        website: '',
        twitter: '',
        turnedPro: 2016,
        lastSeasonPlayed: 2018
    };

    const playerTwo: IPlayer = {

        id: 53,
        firstName: '',
        middleName: '',
        lastName: '',
        shortName: 'Jane Doe',
        dateOfBirth: '',
        sex: '',
        nationality: 'three-body',
        photo: '',
        bioPage: '',
        website: '',
        twitter: '',
        turnedPro: 2013,
        lastSeasonPlayed: 2017
    };

    const year = 2017;
    const target = playerTwo;
    const players = [playerOne, playerTwo];
    let fetcher: jasmine.SpyObj<LivePlayerFetcherService>;
    let fetchByIdSpy: jasmine.Spy;
    let fetchByYearSpy: jasmine.Spy;
    let playerLookup: PlayerLookupService;

    beforeEach(() => {

        fetcher = jasmine.createSpyObj('LivePlayerFetcherService', ['fetchById', 'fetchByYear']);
        fetchByIdSpy = fetcher.fetchById.and.returnValue(of(players[1]));
        fetchByYearSpy = fetcher.fetchByYear.and.returnValue(of(players));

        TestBed.configureTestingModule({
            providers: [
                PlayerLookupService,
                { provide: LivePlayerFetcherService, useValue: fetcher }
            ]
        });

        playerLookup = TestBed.get(PlayerLookupService);
    });

    it('should be created', inject([PlayerLookupService], (service: PlayerLookupService) => {
        expect(service).toBeTruthy();
    }));

    it('getPlayer() should fetch player from server upon new request', () => {

        playerLookup.getPlayer(target.id).subscribe(data => {

            expect(data).toEqual(target);
        });

        expect(fetchByIdSpy.calls.count()).toEqual(1);
    });

    it('getPlayer() should cache player data and return cached data on same request', () => {

        playerLookup.getPlayer(target.id).subscribe(data => {

            expect(data).toEqual(target);

            playerLookup.getPlayer(target.id).subscribe(cachedData => {

                expect(cachedData).toEqual(data);
            });
        });
        // no more subsequent requests after the first request
        expect(fetchByIdSpy.calls.count()).toEqual(1);
    });

    it('getPlayer() should not cache null value returned by server', () => {

        fetchByIdSpy = fetcher.fetchById.and.returnValue(of(null));

        playerLookup.getPlayer(target.id).subscribe(data => {

            playerLookup.getPlayer(target.id).subscribe();
        });

        expect(fetchByIdSpy.calls.count()).toEqual(2);
    });

    it('getPlayer() should return observable of null when failed to retrieve new data', () => {

        fetchByIdSpy = fetcher.fetchById.and.returnValue(of(null));

        playerLookup.getPlayer(target.id).subscribe(data => {

            expect(data).toBeNull();
        });

        expect(fetchByIdSpy.calls.count()).toEqual(1);
    });

    it('getPlayers() should fetch players from server upon request', () => {

        playerLookup.getPlayers(year).subscribe(data => {

            expect(data.size).toEqual(players.length);

            players.forEach(player => {

                expect(data.get(player.id)).toEqual(player);
            });
        });

        expect(fetchByYearSpy.calls.count()).toEqual(1);
    });

    it('getPlayers() should cache player data and return cached data on same request', () => {

        playerLookup.getPlayers(year).subscribe(data => {

            const id = target.id;
            expect(data.size).toEqual(players.length);
            expect(data.get(id)).toEqual(target);

            playerLookup.getPlayers(year).subscribe(cachedData => {

                expect(cachedData.size).toEqual(data.size);
                expect(cachedData.get(id)).toEqual(data.get(id));
            });
            // no more subsequent requests after the first request
            expect(fetchByYearSpy.calls.count()).toEqual(1);
        });
    });

    it('getPlayers() should return observable of null when failed to retrieve data', () => {

        fetchByYearSpy = fetcher.fetchByYear.and.returnValue(of(null));

        playerLookup.getPlayers(year).subscribe(data => {

            expect(data).toBeNull();
        });

        expect(fetchByYearSpy.calls.count()).toEqual(1);
    });
});
