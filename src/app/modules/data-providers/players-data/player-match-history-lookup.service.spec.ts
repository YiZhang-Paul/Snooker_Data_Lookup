import { TestBed, inject } from '@angular/core/testing';
import { of } from 'rxjs';
import { IMatch } from '../match-data/match.interface';
import { ITournamentEvent } from '../event-data/tournament-event.interface';
import { MatchLookupService } from '../match-data/match-lookup.service';
import { EventLookupService } from '../event-data/event-lookup.service';
import { PlayerMatchHistoryLookupService } from './player-match-history-lookup.service';

describe('PlayerMatchHistoryLookupService', () => {

    const matches = <IMatch[]>[

        { eventId: 397, player1: 1, score1: 4, player2: 6, score2: 1 },
        { eventId: 397, player1: 15, score1: 2, player2: 1, score2: 5 },
        { eventId: 403, player1: 1, score1: 1, player2: 97, score2: 3 }
    ];

    const events = <ITournamentEvent[]>[

        { eventId: 397, name: 'UK Championship' },
        { eventId: 403, name: 'Shanghai Masters' }
    ];

    let matchLookup: jasmine.SpyObj<MatchLookupService>;
    let getMatchesOfPlayerSpy: jasmine.Spy;
    let eventLookup: jasmine.SpyObj<EventLookupService>;
    let getEventSpy: jasmine.Spy;
    let historyLookup: PlayerMatchHistoryLookupService;

    beforeEach(() => {

        setupMatchLookup(matches);
        setupEventLookup();

        TestBed.configureTestingModule({

            providers: [

                PlayerMatchHistoryLookupService,
                { provide: MatchLookupService, useValue: matchLookup },
                { provide: EventLookupService, useValue: eventLookup }
            ]
        });

        historyLookup = TestBed.get(PlayerMatchHistoryLookupService);
    });

    it('should be created', inject([PlayerMatchHistoryLookupService], (service: PlayerMatchHistoryLookupService) => {

        expect(service).toBeTruthy();
    }));

    it('should properly return player match history for given year, grouped by events', () => {

        historyLookup.getMatchHistories(1, 2018).subscribe(data => {

            expect(data.length).toEqual(2);

            expect(data[0].event).toEqual(events[0]);
            expect(data[1].event).toEqual(events[1]);

            expect(data[0].matches).toEqual(matches.slice(0, 2));
            expect(data[1].matches).toEqual(matches.slice(2));
        });

        expect(getMatchesOfPlayerSpy).toHaveBeenCalledTimes(1);
        expect(getEventSpy).toHaveBeenCalledTimes(2);
    });

    it('should return empty match history when failed to retrieve match data or match data is missing', () => {

        getMatchesOfPlayerSpy = matchLookup.getMatchesOfPlayer.and.returnValue(of(null));

        historyLookup.getMatchHistories(1, 2018).subscribe(data => {

            expect(data.length).toEqual(0);
        });

        expect(getMatchesOfPlayerSpy).toHaveBeenCalledTimes(1);
        expect(getEventSpy).toHaveBeenCalledTimes(0);
    });

    it('should omit match histories whose corresponding event data is missing or cannot be retrieved', () => {

        getEventSpy = eventLookup.getEvent.and.callFake(targetId => {

            if (targetId === events[0].eventId) {

                return of(events[0]);
            }

            return of(null);
        });

        historyLookup.getMatchHistories(1, 2018).subscribe(data => {

            expect(data.length).toEqual(1);
            expect(data[0].event).toEqual(events[0]);
            expect(data[0].matches).toEqual(matches.slice(0, 2));
        });

        expect(getMatchesOfPlayerSpy).toHaveBeenCalledTimes(1);
        expect(getEventSpy).toHaveBeenCalledTimes(2);
    });

    function setupMatchLookup(response: IMatch[]): void {

        matchLookup = jasmine.createSpyObj('MatchLookupService', ['getMatchesOfPlayer']);
        getMatchesOfPlayerSpy = matchLookup.getMatchesOfPlayer.and.returnValue(of(response));
    }

    function setupEventLookup(): void {

        eventLookup = jasmine.createSpyObj('EventLookupService', ['getEvent']);

        getEventSpy = eventLookup.getEvent.and.callFake(targetId => {

            return of(targetId === events[0].eventId ? events[0] : events[1]);
        });
    }
});
