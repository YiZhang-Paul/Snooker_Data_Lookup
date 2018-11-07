import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IPlayer } from './player.interface';
import { PlayerDataFixerService } from './player-data-fixer.service';
import { CustomLivePlayerFetcherService } from './custom-live-player-fetcher.service';
import { attachCorsProxy } from '../../../app-config';

describe('CustomLivePlayerFetcherServiceService', () => {

    let httpTestingController: HttpTestingController;
    let fetcher: CustomLivePlayerFetcherService;
    let fixer: jasmine.SpyObj<PlayerDataFixerService>;
    let fixSpy: jasmine.Spy;
    const id = 109;
    const year = 2017;
    const urlById = attachCorsProxy(`https://snooker-data-api.herokuapp.com/api/players/${id}`);
    const urlForAll = attachCorsProxy(`https://snooker-data-api.herokuapp.com/api/players`);

    const rawData = [
        {
            activeYears: [2015, 2016],
            ID: id,
            Nationality: 'three-body',
            FirstSeasonAsPro: 2013,
            LastSeasonAsPro: 2018
        },
        {
            activeYears: [2015, 2017],
            ID: id + 1,
            Nationality: 'three-body',
            FirstSeasonAsPro: 2012,
            LastSeasonAsPro: 2018
        }
    ];

    const response = <IPlayer[]>[
        {
            id,
            nationality: 'three-body',
            turnedPro: 2013,
            lastSeasonPlayed: 2018
        },
        {
            id: id + 1,
            nationality: 'three-body',
            turnedPro: 2012,
            lastSeasonPlayed: 2018
        }
    ];

    beforeEach(() => {

        setupDataFixer();

        TestBed.configureTestingModule({

            imports: [HttpClientTestingModule],
            providers: [

                CustomLivePlayerFetcherService,
                { provide: PlayerDataFixerService, useValue: fixer }
            ]
        });

        httpTestingController = TestBed.get(HttpTestingController);
        fetcher = TestBed.get(CustomLivePlayerFetcherService);
    });

    afterEach(() => {

        httpTestingController.verify();
    });

    it('should be created', inject([CustomLivePlayerFetcherService], (service: CustomLivePlayerFetcherService) => {

        expect(service).toBeTruthy();
    }));

    it('fetchById() should return player data response on success', () => {

        fetcher.fetchById(id).subscribe(data => {

            expect(JSON.stringify(data)).toEqual(JSON.stringify(response[0]));
        });

        httpTestingController.expectOne(urlById).flush(rawData[0]);
        expect(fixSpy).toHaveBeenCalledTimes(1);
    });

    it('fetchById() should retry 2 times before returning null on failure', () => {

        fetcher.fetchById(id).subscribe(data => {

            expect(data).toBeNull();
        });

        for (let retries = 2, i = 0; i < retries + 1; i++) {

            httpTestingController.expectOne(urlById).error(null);
        }
    });

    it('fetchByYear() should return player data response on success', () => {

        fetcher.fetchByYear(year).subscribe(data => {

            expect(JSON.stringify(data)).toEqual(JSON.stringify([response[1]]));
        });

        httpTestingController.expectOne(urlForAll).flush(rawData);
        expect(fixSpy).toHaveBeenCalledTimes(1);
    });

    it('fetchByYear() should retry 2 times before returning null on failure', () => {

        fetcher.fetchByYear(year).subscribe(data => {

            expect(data).toBeNull();
        });

        for (let retries = 2, i = 0; i < retries + 1; i++) {

            httpTestingController.expectOne(urlForAll).error(null);
        }
    });

    it('fetchAll() should return player data response on success', () => {

        fetcher.fetchAll().subscribe(data => {

            expect(JSON.stringify(data)).toEqual(JSON.stringify(response));
        });

        httpTestingController.expectOne(urlForAll).flush(rawData);
        expect(fixSpy).toHaveBeenCalledTimes(rawData.length);
    });

    it('fetchAll() should retry 2 times before returning null on failure', () => {

        fetcher.fetchAll().subscribe(data => {

            expect(data).toBeNull();
        });

        for (let retries = 2, i = 0; i < retries + 1; i++) {

            httpTestingController.expectOne(urlForAll).error(null);
        }
    });

    function setupDataFixer(): void {

        fixer = jasmine.createSpyObj('PlayerDataFixerService', ['fix']);
        fixSpy = fixer.fix.and.callFake(player => player);
    }
});
