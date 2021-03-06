import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ITournamentEvent } from '../../data-providers/event-data/tournament-event.interface';
import { IMatch } from '../../data-providers/match-data/match.interface';
import { IMatchHistory } from '../../data-providers/players-data/match-history.interface';
import { PlayerMatchHistoryLookupService } from '../../data-providers/players-data/player-match-history-lookup.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { PlayerHistoryComponent } from './player-history.component';

@Component({ selector: 'app-match-history-listing', template: '' })
class MatchHistoryListingComponent {

    @Input() history: IMatchHistory;
}

describe('PlayerHistoryComponent', () => {

    const event = <ITournamentEvent>{ eventId: 397, name: 'UK Championship' };

    const matches = <IMatch[]>[

        { player1: 1, score1: 4, player2: 6, score2: 1 },
        { player1: 1, score1: 5, player2: 15, score2: 2 }
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

            imports: [

                NoopAnimationsModule,
                RouterTestingModule,
                MatProgressSpinnerModule,
                MatSelectModule
            ],
            declarations: [PlayerHistoryComponent, MatchHistoryListingComponent],
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

    it('should load match history for current season on default when successfully retrieved player id', fakeAsync(() => {

        expect(component.histories).not.toEqual(historyOne);

        fixture.detectChanges();
        tick();

        expect(component.selectedYear).toEqual(expectedYear);
        expect(component.histories).toEqual(historyOne);
        expect(getMatchHistoriesSpy).toHaveBeenCalledTimes(1);
    }));

    it('should not load match history when player id cannot be retrieved', fakeAsync(() => {

        setupParamMapSpy({ foo: 1 });
        expect(component.histories).not.toEqual(historyOne);

        fixture.detectChanges();
        tick();

        expect(component.histories).not.toEqual(historyOne);
        expect(getMatchHistoriesSpy).toHaveBeenCalledTimes(1);
    }));

    it('should load match history for selected year', fakeAsync(() => {

        fixture.detectChanges();
        tick();

        expect(component.histories).not.toEqual(historyTwo);

        component.onYearSelected('2015');
        fixture.detectChanges();

        expect(component.selectedYear).toEqual(2015);
        expect(component.histories).toEqual(historyTwo);
        expect(getMatchHistoriesSpy).toHaveBeenCalledTimes(2);
    }));

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
