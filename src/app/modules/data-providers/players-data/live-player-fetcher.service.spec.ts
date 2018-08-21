import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IPlayer } from './player.interface';
import { LivePlayerFetcherService } from './live-player-fetcher.service';

describe('LivePlayerFetcherService', () => {

    let httpTestingController: HttpTestingController;
    let fetcher: LivePlayerFetcherService;
    const url = `http://api.snooker.org/?t=10&st=p&s=2017`;

    const rawData: object[] = [{

        ID: 107,
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

        id: 107,
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

    it('should return player data response on success', () => {

        fetcher.fetch(2017).subscribe(data => {

            expect(JSON.stringify(data)).toEqual(JSON.stringify(response));
        });

        httpTestingController.expectOne(url).flush(rawData);
    });

    it('should retry 2 times before returning null on failure', () => {

        const totalRetries = 2;

        fetcher.fetch(2017).subscribe(data => {

            expect(data).toBeNull();
        });

        for (let i = 0; i < totalRetries + 1; i++) {

            httpTestingController.expectOne(url).error(null);
        }
    });
});
