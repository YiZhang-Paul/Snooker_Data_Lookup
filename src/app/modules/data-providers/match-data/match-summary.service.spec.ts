import { TestBed, inject } from '@angular/core/testing';
import { of } from 'rxjs';
import { IPlayer } from '../players-data/player.interface';
import { IMatch } from '../match-data/match.interface';
import { PlayerLookupService } from '../players-data/player-lookup.service';
import { MatchSummaryService } from './match-summary.service';

describe('MatchSummaryService', () => {

    const playerOne = <IPlayer>{ id: 1, get shortFullName(): string { return 'John Doe'; } };
    const playerTwo = <IPlayer>{ id: 17, get shortFullName(): string { return 'Jane Doe'; } };
    const match = <IMatch>{ player1: 1, player2: 17, score1: 4, score2: 1 };

    let lookup: jasmine.SpyObj<PlayerLookupService>;
    let getPlayerSpy: jasmine.Spy;
    let summary: MatchSummaryService;

    beforeEach(() => {

        setupPlayerLookup();

        TestBed.configureTestingModule({

            providers: [

                MatchSummaryService,
                { provide: PlayerLookupService, useValue: lookup }
            ]
        });

        summary = TestBed.get(MatchSummaryService);
    });

    it('should be created', inject([MatchSummaryService], (service: MatchSummaryService) => {

        expect(service).toBeTruthy();
    }));

    it('getShortSummary() should properly construct summary with valid players', () => {

        summary.getShortSummary(match, match.player1).subscribe(data => {

            expect(data).toEqual('John Doe 4 - 1 Jane Doe');
        });

        expect(getPlayerSpy).toHaveBeenCalledTimes(2);
    });

    it('getShortSummary() should place player with higher priority on the left', () => {

        summary.getShortSummary(match, match.player2).subscribe(data => {

            expect(data).toEqual('Jane Doe 1 - 4 John Doe');
        });

        expect(getPlayerSpy).toHaveBeenCalledTimes(2);
    });

    it('getShortSummary() should display "N/A" as name for invalid players', () => {

        const anotherMatch = <IMatch>{ player1: 5, player2: 17, score1: 4, score2: 1 };

        summary.getShortSummary(anotherMatch, anotherMatch.player1).subscribe(data => {

            expect(data).toEqual('N/A 4 - 1 Jane Doe');
        });

        expect(getPlayerSpy).toHaveBeenCalledTimes(2);
    });

    it('getShortSummary() should indicate unstarted match when applicable', () => {

        const anotherMatch = <IMatch>{

            player1: 1, player2: 17, score1: 0, score2: 0, winner: 0, walkover: null
        };

        summary.getShortSummary(anotherMatch, anotherMatch.player1).subscribe(data => {

            expect(data).toEqual('John Doe 0 - 0 Jane Doe (TBA)');
        });

        expect(getPlayerSpy).toHaveBeenCalledTimes(2);
    });

    function setupPlayerLookup(): void {

        lookup = jasmine.createSpyObj('PlayerLookupService', ['getPlayer']);

        getPlayerSpy = lookup.getPlayer.and.callFake(targetId => {

            if (targetId !== playerOne.id && targetId !== playerTwo.id) {

                return of(null);
            }

            return of(targetId === playerOne.id ? playerOne : playerTwo);
        });
    }
});
