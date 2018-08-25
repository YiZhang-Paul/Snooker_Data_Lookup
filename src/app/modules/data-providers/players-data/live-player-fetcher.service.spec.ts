import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IPlayer } from './player.interface';
import { LivePlayerFetcherService } from './live-player-fetcher.service';

describe('LivePlayerFetcherService', () => {

    let httpTestingController: HttpTestingController;
    let fetcher: LivePlayerFetcherService;
    const id = 109;
    const year = 2017;
    const urlById = `http://api.snooker.org/?p=${id}`;
    const urlByYear = `http://api.snooker.org/?t=10&st=p&s=${year}`;

    const rawData: object[] = [{

        ID: id,
        FirstName: '',
        MiddleName: '',
        LastName: '',
        ShortName: 'John Doe',
        Born: '',
        Sex: '',
        Nationality: 'three-body',
        Photo: '',
        BioPage: '',
        URL: '',
        Twitter: '',
        FirstSeasonAsPro: 2017,
        LastSeasonAsPro: 2018
    }];

    const response: IPlayer[] = [{

        id,
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
        turnedPro: 2017,
        lastSeasonPlayed: 2018
    }];

    beforeEach(() => {

        TestBed.configureTestingModule({

            imports: [HttpClientTestingModule],
            providers: [LivePlayerFetcherService]
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
    });

    it('fetchByYear() should retry 2 times before returning null on failure', () => {

        fetcher.fetchByYear(year).subscribe(data => {

            expect(data).toBeNull();
        });

        for (let retries = 2, i = 0; i < retries + 1; i++) {

            httpTestingController.expectOne(urlByYear).error(null);
        }
    });
});
