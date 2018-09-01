import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { of } from 'rxjs';
import { ITournamentEvent } from '../../../data-providers/event-data/tournament-event.interface';
import { IMatch } from '../../../data-providers/match-data/match.interface';
import { IMatchHistory } from '../../../data-providers/players-data/match-history.interface';
import { IPlayer } from '../../../data-providers/players-data/player.interface';
import { queryByDirective, queryByCss, queryAllByCss } from '../../../../../testing/custom-test-utilities';
import { PlayerLookupService } from '../../../data-providers/players-data/player-lookup.service';
import { MatchHistoryListingComponent } from './match-history-listing.component';

const event: ITournamentEvent = {
    // * only event name matters here
    eventId: 397, previousEventId: 0, mainEventId: 397, worldSnookerId: 13853,
    name: 'UK Championship', stage: 'f', type: 'r', participants: 128,
    defendingChampion: 5, season: 2018, sponsor: '', startDate: '', endDate: '',
    stops: 0, venue: '', city: '', country: '', sex: '', ageGroup: '',
    url: '', twitter: '', photos: '', hashTag: '', related: ''
};

const matches: IMatch[] = [{
    // * only player1, player2, score1 and score2 matter here
    matchId: 3420410, eventId: 397, worldSnookerId: 386770,
    startDate: '', endDate: '', scheduledDate: '',
    round: 7, session: '', tableNumber: 0, frameScores: '',
    player1: 1, score1: 4, player2: 6, score2: 1, walkover: null, winner: 1,
    ongoing: false, onBreak: false, liveUrl: '', vodUrl: '', detailsUrl: ''
}];

@Component({
    template: `
        <app-match-history-listing
            [history]="history">
        </app-match-history-listing>
    `
})
class TestComponent {

    history: IMatchHistory = { event, matches };
}

describe('MatchHistoryListingComponent', () => {

    const players: IPlayer[] = [
        // * only player id, first name and last name matter here
        {
            id: 1, firstName: 'John', middleName: '', lastName: 'Doe',
            shortName: '', dateOfBirth: '', sex: '', nationality: '',
            photo: '', bioPage: '', website: '', twitter: '',
            turnedPro: 2016, lastSeasonPlayed: 2018
        },
        {
            id: 6, firstName: 'Jane', middleName: '', lastName: 'Doe',
            shortName: '', dateOfBirth: '', sex: '', nationality: '',
            photo: '', bioPage: '', website: '', twitter: '',
            turnedPro: 2013, lastSeasonPlayed: 2017
        }
    ];

    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;
    let lookup: jasmine.SpyObj<PlayerLookupService>;
    let getPlayerSpy: jasmine.Spy;
    let listingDebugElement: DebugElement;
    let listing: MatchHistoryListingComponent;

    beforeEach(async(() => {

        setupPlayerLookup(players);

        TestBed.configureTestingModule({

            declarations: [TestComponent, MatchHistoryListingComponent],
            providers: [{ provide: PlayerLookupService, useValue: lookup }]

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

        expect(listing.history).toEqual(component.history);
    });

    it('should display event name properly', () => {

        const title = queryByCss(fixture.debugElement, 'h3');
        const eventName = component.history.event.name;

        checkTextContent(title, eventName);
    });

    it('should display match summaries properly', () => {

        const summaries = queryAllByCss(fixture.debugElement, 'li');

        expect(summaries.length).toEqual(1);
        checkTextContent(summaries[0], 'John Doe 4 - 1 Jane Doe');
        expect(getPlayerSpy).toHaveBeenCalledTimes(2);
    });

    function setupPlayerLookup(response: IPlayer[]): void {

        lookup = jasmine.createSpyObj('PlayerLookupService', ['getPlayer']);
        getPlayerSpy = lookup.getPlayer.and.returnValues(of(players[0]), of(players[1]));
    }

    function checkTextContent(debugElement: DebugElement, text: string): void {

        expect(debugElement.nativeElement.textContent).toEqual(text);
    }
});
