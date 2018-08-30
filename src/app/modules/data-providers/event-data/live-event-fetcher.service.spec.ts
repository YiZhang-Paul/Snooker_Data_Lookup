import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ITournamentEvent } from './tournament-event.interface';
import { LiveEventFetcherService } from './live-event-fetcher.service';

describe('LiveEventFetcherService', () => {

    let httpTestingController: HttpTestingController;
    let fetcher: LiveEventFetcherService;
    const id = 479;
    const urlById = `http://api.snooker.org/?e=${id}`;

    const rawData: object[] = [{

        ID: 410,
        Name: 'UK Championship',
        StartDate: '2015-11-24',
        EndDate: '2015-12-06',
        Sponsor: 'Betway',
        Season: 2015,
        Type: 'Ranking',
        Num: 0,
        Venue: 'Barbican Centre',
        City: 'York',
        Country: 'England',
        Main: 410,
        Sex: 'Both',
        AgeGroup: 'O',
        Url: '',
        Related: 'uk',
        Stage: 'F',
        WorldSnookerId: 13853,
        Twitter: '',
        HashTag: 'UKChampionship',
        PhotoURLs: '',
        NumCompetitors: 128,
        DefendingChampion: 5,
        PreviousEdition: 353
    }];

    const response: ITournamentEvent = {

        eventId: 410,
        previousEventId: 353,
        mainEventId: 410,
        worldSnookerId: 13853,
        name: 'UK Championship',
        stage: 'F',
        type: 'Ranking',
        participants: 128,
        defendingChampion: 5,
        season: 2015,
        sponsor: 'Betway',
        startDate: '2015-11-24',
        endDate: '2015-12-06',
        stops: 0,
        venue: 'Barbican Centre',
        city: 'York',
        country: 'England',
        sex: 'Both',
        ageGroup: 'O',
        url: '',
        twitter: '',
        photos: '',
        hashTag: 'UKChampionship',
        related: 'uk'
    };

    beforeEach(() => {

        TestBed.configureTestingModule({

            imports: [HttpClientTestingModule],
            providers: [LiveEventFetcherService]
        });

        httpTestingController = TestBed.get(HttpTestingController);
        fetcher = TestBed.get(LiveEventFetcherService);
    });

    afterEach(() => {

        httpTestingController.verify();
    });

    it('should be created', inject([LiveEventFetcherService], (service: LiveEventFetcherService) => {

        expect(service).toBeTruthy();
    }));

    it('fetchById() should return event data response on success', () => {

        fetcher.fetchById(id).subscribe(data => {

            expect(JSON.stringify(data)).toEqual(JSON.stringify(response));
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
});
