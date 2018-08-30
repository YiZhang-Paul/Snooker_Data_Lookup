import { TestBed, inject } from '@angular/core/testing';
import { of } from 'rxjs';
import { ITournamentEvent } from './tournament-event.interface';
import { LiveEventFetcherService } from './live-event-fetcher.service';
import { EventLookupService } from './event-lookup.service';

describe('EventLookupService', () => {

    const event: ITournamentEvent = {

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

    const id = event.eventId;
    let fetcher: jasmine.SpyObj<LiveEventFetcherService>;
    let fetchByIdSpy: jasmine.Spy;
    let lookup: EventLookupService;

    beforeEach(() => {

        setupFetcher(event);

        TestBed.configureTestingModule({

            providers: [

                EventLookupService,
                { provide: LiveEventFetcherService, useValue: fetcher }
            ]
        });

        lookup = TestBed.get(EventLookupService);
    });

    it('should be created', inject([EventLookupService], (service: EventLookupService) => {

        expect(service).toBeTruthy();
    }));

    it('getEvent() should fetch event data from server upon new request', () => {

        lookup.getEvent(id).subscribe(data => {

            expect(data).toEqual(event);
        });

        expect(fetchByIdSpy).toHaveBeenCalledTimes(1);
    });

    it('getEvent() should cache event data and return cached data on same request', () => {

        lookup.getEvent(id).subscribe(data => {

            expect(data).toEqual(event);

            lookup.getEvent(id).subscribe(cachedData => {

                expect(cachedData).toEqual(data);
            });
        });
        // no more subsequent requests after the first request
        expect(fetchByIdSpy).toHaveBeenCalledTimes(1);
    });

    it('getEvent() should not cache null value returned by server', () => {

        fetchByIdSpy = fetcher.fetchById.and.returnValue(of(null));

        lookup.getEvent(id).subscribe(() => {

            lookup.getEvent(id).subscribe();
        });

        expect(fetchByIdSpy).toHaveBeenCalledTimes(2);
    });

    it('getEvent() should return observable of null when failed to retrieve new data', () => {

        fetchByIdSpy = fetcher.fetchById.and.returnValue(of(null));

        lookup.getEvent(id).subscribe(data => {

            expect(data).toBeNull();
        });

        expect(fetchByIdSpy).toHaveBeenCalledTimes(1);
    });

    function setupFetcher(response: ITournamentEvent): void {

        fetcher = jasmine.createSpyObj('LiveEventFetcherService', ['fetchById']);
        fetchByIdSpy = fetcher.fetchById.and.returnValue(of(response));
    }
});
