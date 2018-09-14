import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Component, DebugElement } from '@angular/core';
import { of } from 'rxjs';
import { ITournamentEvent } from '../../../data-providers/event-data/tournament-event.interface';
import { IPlayer } from '../../../data-providers/players-data/player.interface';
import { IMatch } from '../../../data-providers/match-data/match.interface';
import { IMatchHistory } from '../../../data-providers/players-data/match-history.interface';
import { queryByDirective, queryByCss, queryAllByCss } from '../../../../../testing/custom-test-utilities';
import { MatchSummaryService } from '../../../data-providers/match-data/match-summary.service';
import { CountryFlagLookupService } from '../../../../shared/services/country-flag-lookup.service';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatchHistoryListingComponent } from './match-history-listing.component';

@Component({
    template: `
        <app-match-history-listing
            [history]="history"
            [id]="id">
        </app-match-history-listing>
    `
})
class TestComponent {

    id: 1;
    history: IMatchHistory = {

        event: <ITournamentEvent>{ eventId: 397, name: 'UK Championship' },
        matches: <IMatch[]>[{ player1: 1, score1: 4, player2: 6, score2: 1 }]
    };
}

describe('MatchHistoryListingComponent', () => {

    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;
    let summary: jasmine.SpyObj<MatchSummaryService>;
    let getShortSummaryArray$Spy: jasmine.Spy;
    let flagLookup: jasmine.SpyObj<CountryFlagLookupService>;
    let getFlags$Spy: jasmine.Spy;
    let listingDebugElement: DebugElement;
    let listing: MatchHistoryListingComponent;

    const playerOne = <IPlayer>{

        id: 1,
        nationality: 'three-body',
        get shortFullName(): string { return 'John Doe'; }
    };

    const playerTwo = <IPlayer>{

        id: 6,
        nationality: 'three-body',
        get shortFullName(): string { return 'Jane Doe'; }
    };

    const summaryData = <[IPlayer, IPlayer, string, boolean]>[playerOne, playerTwo, '4 - 1', true];

    beforeEach(async(() => {

        setupMatchSummary(summaryData);
        setupFlagLookup();

        TestBed.configureTestingModule({

            imports: [MatListModule, MatExpansionModule, NoopAnimationsModule],
            declarations: [TestComponent, MatchHistoryListingComponent],
            providers: [

                { provide: MatchSummaryService, useValue: summary },
                { provide: CountryFlagLookupService, useValue: flagLookup }
            ]

        }).compileComponents();
    }));

    beforeEach(() => {

        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        listingDebugElement = queryByDirective(fixture.debugElement, MatchHistoryListingComponent);
        listing = listingDebugElement.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {

        expect(component).toBeTruthy();
    });

    it('should properly bind to input properties', () => {

        expect(listing.id).toEqual(component.id);
        expect(listing.history).toEqual(component.history);
    });

    it('should display event name properly', () => {

        const title = queryByCss(fixture.debugElement, '.name');
        const eventName = component.history.event.name;

        checkTextContent(title, eventName);
    });

    it('should display match summaries properly', () => {

        const summaries = queryAllByCss(fixture.debugElement, '.match');

        expect(summaries.length).toEqual(1);
        checkTextContent(summaries[0], 'John Doe 4 - 1 Jane Doe');
        expect(getShortSummaryArray$Spy).toHaveBeenCalledTimes(1);
    });

    function setupMatchSummary(data: [IPlayer, IPlayer, string, boolean]): void {

        summary = jasmine.createSpyObj('MatchSummaryService', ['getShortSummaryArray']);
        getShortSummaryArray$Spy = summary.getShortSummaryArray.and.returnValue(of(data));
    }

    function setupFlagLookup(): void {

        flagLookup = jasmine.createSpyObj('CountryFlagLookupService', ['getFlags']);
        getFlags$Spy = flagLookup.getFlags.and.returnValue(of(new Map<string, string>()));
    }

    function checkTextContent(debugElement: DebugElement, text: string): void {

        expect(debugElement.nativeElement.textContent.trim()).toEqual(text);
    }
});
