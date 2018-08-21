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
    const players = [playerOne, playerTwo];
    let fetcher: jasmine.SpyObj<LivePlayerFetcherService>;
    let fetchSpy: jasmine.Spy;
    let playerLookup: PlayerLookupService;

    beforeEach(() => {

        fetcher = jasmine.createSpyObj('LivePlayerFetcherService', ['fetch']);
        fetchSpy = fetcher.fetch.and.returnValue(of(players));

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

    it('getPlayers() should fetch players from server upon new request', () => {

        playerLookup.getPlayers(year).subscribe(data => {

            expect(data.length).toEqual(players.length);

            for (let i = 0; i < data.length; i++) {

                expect(data[i].id).toEqual(players[i].id);
            }
        });

        expect(fetchSpy.calls.count()).toEqual(1);
    });

    it('getPlayers() should cache player data and return cached data on same request', () => {

        playerLookup.getPlayers(year).subscribe(data => {

            expect(data.length).toEqual(players.length);
            expect(data[0].id).toEqual(players[0].id);

            playerLookup.getPlayers(year).subscribe(cachedData => {

                expect(cachedData.length).toEqual(data.length);
                expect(cachedData[0].id).toEqual(data[0].id);
            });
            // no more subsequent requests after the first request
            expect(fetchSpy.calls.count()).toEqual(1);
        });
    });

    it('getPlayers() should return observable of null when failed to retrieve data', () => {

        const fetchFailedSpy = fetcher.fetch.and.returnValue(of(null));

        playerLookup.getPlayers(year).subscribe(data => {

            expect(data).toBeNull();
        });

        expect(fetchFailedSpy.calls.count()).toEqual(1);
    });

    it('getPlayer() should fetch players from server upon new request', () => {

        const target = players[1];

        playerLookup.getPlayer(year, target.id).subscribe(data => {

            expect(data.id).toEqual(target.id);
            expect(data.nationality).toEqual(target.nationality);
            expect(data.shortName).toEqual(target.shortName);
        });

        expect(fetchSpy.calls.count()).toEqual(1);
    });

    it('getPlayer() should cache player data and return cached data on same request', () => {

        const target = players[1];

        playerLookup.getPlayer(year, target.id).subscribe(data => {

            expect(data.id).toEqual(target.id);
            expect(data.nationality).toEqual(target.nationality);
            expect(data.shortName).toEqual(target.shortName);

            playerLookup.getPlayer(year, target.id).subscribe(cachedData => {

                expect(cachedData.id).toEqual(data.id);
                expect(cachedData.nationality).toEqual(data.nationality);
                expect(cachedData.shortName).toEqual(data.shortName);
            });
        });
        // no more subsequent requests after the first request
        expect(fetchSpy.calls.count()).toEqual(1);
    });

    it('getPlayer() should return observable of null when failed to retrieve new data', () => {

        const fetchFailedSpy = fetcher.fetch.and.returnValue(of(null));

        playerLookup.getPlayer(year, players[0].id).subscribe(data => {

            expect(data).toBeNull();
        });

        expect(fetchFailedSpy.calls.count()).toEqual(1);
    });

    it('getPlayer() should return observable of null when data is cached but without target player', () => {

        const cachedPlayer = players[0];
        const nonExistentPlayer = players[1];
        const fetchFailedSpy = fetcher.fetch.and.returnValue(of([cachedPlayer]));

        playerLookup.getPlayer(year, cachedPlayer.id).subscribe(data => {

            expect(data.id).toEqual(cachedPlayer.id);
            // same year, but requesting a non-existent player
            playerLookup.getPlayer(year, nonExistentPlayer.id).subscribe(cachedData => {

                expect(cachedData).toBeNull();
            });
        });
        // no more subsequent requests after the first request
        expect(fetchFailedSpy.calls.count()).toEqual(1);
    });
});
