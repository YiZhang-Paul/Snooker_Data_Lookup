import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IPlayer } from './player.interface';
import { PlayerDataFixerService } from './player-data-fixer.service';
import { LivePlayerFetcherService } from './live-player-fetcher.service';
import { attachCorsProxy } from '../../../app-config';

describe('LivePlayerFetcherService', () => {

    let httpTestingController: HttpTestingController;
    let fetcher: LivePlayerFetcherService;
    let fixer: jasmine.SpyObj<PlayerDataFixerService>;
    let fixSpy: jasmine.Spy;
    const id = 109;
    const year = 2017;
    const urlById = attachCorsProxy(`http://api.snooker.org/?p=${id}`);
    const urlByYear = attachCorsProxy(`http://api.snooker.org/?t=10&st=p&s=${year}`);

    const rawData = [{

        ID: id,
        Nationality: 'three-body',
        FirstSeasonAsPro: 2017,
        LastSeasonAsPro: 2018
    }];

    const response = <IPlayer[]>[{

        id,
        nationality: 'three-body',
        turnedPro: 2017,
        lastSeasonPlayed: 2018
    }];

    beforeEach(() => {

        setupDataFixer();

        TestBed.configureTestingModule({

            imports: [HttpClientTestingModule],
            providers: [

                LivePlayerFetcherService,
                { provide: PlayerDataFixerService, useValue: fixer }
            ]
        });

        httpTestingController = TestBed.get(HttpTestingController);
        fetcher = TestBed.get(LivePlayerFetcherService);
    });

    afterEach(() => {

        httpTestingController.verify();
    });

    it('should be created', inject([LivePlayerFetcherService], (service: LivePlayerFetcherService) => {

        expect(service).toBeTruthy();
    }));

    it('fetchById() should return player data response on success', () => {

        fetcher.fetchById(id).subscribe(data => {

            expect(JSON.stringify(data)).toEqual(JSON.stringify(response[0]));
        });

        httpTestingController.expectOne(urlById).flush([rawData[0]]);
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

            expect(JSON.stringify(data)).toEqual(JSON.stringify(response));
        });

        httpTestingController.expectOne(urlByYear).flush(rawData);
        expect(fixSpy).toHaveBeenCalledTimes(response.length);
    });

    it('fetchByYear() should retry 2 times before returning null on failure', () => {

        fetcher.fetchByYear(year).subscribe(data => {

            expect(data).toBeNull();
        });

        for (let retries = 2, i = 0; i < retries + 1; i++) {

            httpTestingController.expectOne(urlByYear).error(null);
        }
    });

    function setupDataFixer(): void {

        fixer = jasmine.createSpyObj('PlayerDataFixerService', ['fix']);
        fixSpy = fixer.fix.and.callFake(player => player);
    }
});
