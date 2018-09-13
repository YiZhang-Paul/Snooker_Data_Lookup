import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ITournamentEvent } from './tournament-event.interface';
import { LiveEventFetcherService } from './live-event-fetcher.service';
import { attachCorsProxy } from '../../../app-config';

describe('LiveEventFetcherService', () => {

    let httpTestingController: HttpTestingController;
    let fetcher: LiveEventFetcherService;
    const id = 479;
    const urlById = attachCorsProxy(`http://api.snooker.org/?e=${id}`);

    const rawData = [{

        ID: 410,
        Name: 'UK Championship',
        Season: 2015
    }];

    const response = <ITournamentEvent>{

        eventId: 410,
        name: 'UK Championship',
        season: 2015
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
