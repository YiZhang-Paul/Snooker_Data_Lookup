import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ITournamentEvent } from '../../data-providers/event-data/tournament-event.interface';
import { IMatch } from '../../data-providers/match-data/match.interface';
import { IMatchHistory } from '../../data-providers/players-data/match-history.interface';
import { PlayerMatchHistoryLookupService } from '../../data-providers/players-data/player-match-history-lookup.service';
import { PlayerHistoryComponent } from './player-history.component';

describe('PlayerHistoryComponent', () => {

    const event: ITournamentEvent = {

        eventId: 397, previousEventId: 0, mainEventId: 397, worldSnookerId: 13853,
        name: 'UK Championship', stage: 'f', type: 'r', participants: 128,
        defendingChampion: 5, season: 2018, sponsor: '', startDate: '', endDate: '',
        stops: 0, venue: '', city: '', country: '', sex: '', ageGroup: '',
        url: '', twitter: '', photos: '', hashTag: '', related: ''
    };

    const matches: IMatch[] = [

        {
            matchId: 3420410, eventId: 397, worldSnookerId: 386770,
            startDate: '', endDate: '', scheduledDate: '',
            round: 7, session: '', tableNumber: 0, frameScores: '',
            player1: 1, score1: 4, player2: 6, score2: 1, walkover: null, winner: 1,
            ongoing: false, onBreak: false, liveUrl: '', vodUrl: '', detailsUrl: ''
        },
        {
            matchId: 3420415, eventId: 397, worldSnookerId: 386791,
            startDate: '', endDate: '', scheduledDate: '',
            round: 8, session: '', tableNumber: 0, frameScores: '',
            player1: 1, score1: 5, player2: 15, score2: 2, walkover: null, winner: 1,
            ongoing: false, onBreak: false, liveUrl: '', vodUrl: '', detailsUrl: ''
        }
    ];

    let fixture: ComponentFixture<PlayerHistoryComponent>;
    let component: PlayerHistoryComponent;
    let routes: ActivatedRoute;
    let routesParentSpy: jasmine.Spy;
    let historyLookup: jasmine.SpyObj<PlayerMatchHistoryLookupService>;
    let getMatchHistoriesSpy: jasmine.Spy;
    const historyOne: IMatchHistory[] = [{ event, matches : [matches[0]] }];
    const historyTwo: IMatchHistory[] = [{ event, matches : [matches[1]] }];
    const expectedId = matches[0].player1;
    const expectedYear = new Date().getFullYear();

    beforeEach(async(() => {

        setupHistoryLookup(historyOne);

        TestBed.configureTestingModule({

            imports: [RouterTestingModule],
            declarations: [PlayerHistoryComponent],
            providers: [{ provide: PlayerMatchHistoryLookupService, useValue: historyLookup }]

        }).compileComponents();

        routes = TestBed.get(ActivatedRoute);
        routesParentSpy = spyOnProperty(routes, 'parent');
        setupParamMapSpy({ id: expectedId });
    }));

    beforeEach(() => {

        fixture = TestBed.createComponent(PlayerHistoryComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {

        expect(component).toBeTruthy();
    });

    it('should load match history for current season on default when successfully retrieved player id', () => {

        expect(component.histories).not.toEqual(historyOne);

        fixture.detectChanges();

        expect(component.selectedYear).toEqual(expectedYear);
        expect(component.histories).toEqual(historyOne);
        expect(getMatchHistoriesSpy).toHaveBeenCalledTimes(1);
    });

    it('should not load match history when player id cannot be retrieved', () => {

        setupParamMapSpy({ foo: 1 });
        expect(component.histories).not.toEqual(historyOne);

        fixture.detectChanges();

        expect(component.histories).not.toEqual(historyOne);
        expect(getMatchHistoriesSpy).toHaveBeenCalledTimes(1);
    });

    it('should load match history for selected year', () => {

        fixture.detectChanges();
        expect(component.histories).toEqual(historyOne);

        component.onYearSelected('2015');
        fixture.detectChanges();

        expect(component.selectedYear).toEqual(2015);
        expect(component.histories).toEqual(historyTwo);
        expect(getMatchHistoriesSpy).toHaveBeenCalledTimes(2);
    });

    function setupHistoryLookup(response: IMatchHistory[]): void {

        historyLookup = jasmine.createSpyObj(

            'PlayerMatchHistoryLookupService', ['getMatchHistories']
        );

        getMatchHistoriesSpy = historyLookup.getMatchHistories.and.callFake((targetId, targetYear) => {

            if (targetId !== expectedId) {

                return of(null);
            }

            return of(targetYear === expectedYear ? historyOne : historyTwo);
        });
    }

    function setupParamMapSpy(map: object): void {

        const parent = new ActivatedRoute();
        routesParentSpy.and.returnValue(parent);

        const paramMap$ = of(convertToParamMap(map));
        spyOnProperty(parent, 'paramMap').and.returnValue(paramMap$);
    }
});
