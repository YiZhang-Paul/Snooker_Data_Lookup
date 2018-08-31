import { TestBed, inject } from '@angular/core/testing';
import { of } from 'rxjs';
import { IMatch } from '../match-data/match.interface';
import { ITournamentEvent } from '../event-data/tournament-event.interface';
import { MatchLookupService } from '../match-data/match-lookup.service';
import { EventLookupService } from '../event-data/event-lookup.service';
import { PlayerMatchHistoryLookupService } from './player-match-history-lookup.service';

describe('PlayerMatchHistoryLookupService', () => {

    const matches: IMatch[] = [
        // only eventId matters here
        {
            matchId: 3420410, eventId: 397, worldSnookerId: 386770,
            startDate: '', endDate: '', scheduledDate: '',
            round: 7, session: '', tableNumber: 0, frameScores: '',
            player1: 1, score1: 4, player2: 6, score2: 1, walkover: null, winner: 1,
            ongoing: false, onBreak: false, liveUrl: '', vodUrl: '', detailsUrl: ''
        },
        {
            matchId: 3421024, eventId: 397, worldSnookerId: 387100,
            startDate: '', endDate: '', scheduledDate: '',
            round: 8, session: '', tableNumber: 1, frameScores: '',
            player1: 15, score1: 2, player2: 1, score2: 5, walkover: null, winner: 1,
            ongoing: false, onBreak: false, liveUrl: '', vodUrl: '', detailsUrl: ''
        },
        {
            matchId: 3421201, eventId: 403, worldSnookerId: 387098,
            startDate: '', endDate: '', scheduledDate: '',
            round: 2, session: '', tableNumber: 5, frameScores: '',
            player1: 1, score1: 1, player2: 97, score2: 3, walkover: null, winner: 97,
            ongoing: false, onBreak: false, liveUrl: '', vodUrl: '', detailsUrl: ''
        }
    ];

    const events: ITournamentEvent[] = [
        // only eventId matters here
        {
            eventId: 397, previousEventId: 0, mainEventId: 397, worldSnookerId: 13853,
            name: 'UK Championship', stage: 'f', type: 'r', participants: 128,
            defendingChampion: 5, season: 2018, sponsor: '', startDate: '', endDate: '',
            stops: 0, venue: '', city: '', country: '', sex: '', ageGroup: '',
            url: '', twitter: '', photos: '', hashTag: '', related: ''
        },
        {
            eventId: 403, previousEventId: 0, mainEventId: 403, worldSnookerId: 13910,
            name: 'Shanghai Masters', stage: 'f', type: 'r', participants: 32,
            defendingChampion: 5, season: 2018, sponsor: '', startDate: '', endDate: '',
            stops: 0, venue: '', city: '', country: '', sex: '', ageGroup: '',
            url: '', twitter: '', photos: '', hashTag: '', related: ''
        }
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
