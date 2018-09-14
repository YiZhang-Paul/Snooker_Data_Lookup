import { TestBed, inject } from '@angular/core/testing';
import { of } from 'rxjs';
import { IPlayer } from '../players-data/player.interface';
import { IMatch } from '../match-data/match.interface';
import { PlayerLookupService } from '../players-data/player-lookup.service';
import { MatchSummaryService } from './match-summary.service';

describe('MatchSummaryService', () => {

    const playerOne = <IPlayer>{ id: 1, get shortFullName(): string { return 'John Doe'; } };
    const playerTwo = <IPlayer>{ id: 17, get shortFullName(): string { return 'Jane Doe'; } };
    const matchOne = <IMatch>{ player1: 1, player2: 17, score1: 4, score2: 1 };
    const matchTwo = <IMatch>{ player1: 5, player2: 17, score1: 4, score2: 1 };
    const matchThree = <IMatch>{ player1: 1, player2: 17, score1: 0, score2: 0, winner: 0, walkover: null };

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

    it('getShortSummaryArray() should properly construct summary with valid players', () => {

        summary.getShortSummaryArray(matchOne, matchOne.player1).subscribe(data => {

            expect(data.length).toEqual(4);
            expect(data[0]).toEqual(playerOne);
            expect(data[1]).toEqual(playerTwo);
            expect(data[2]).toEqual('4 - 1');
            expect(data[3]).toBeTruthy();
        });

        expect(getPlayerSpy).toHaveBeenCalledTimes(2);
    });

    it('getShortSummaryArray() should place player with higher priority on the left', () => {

        summary.getShortSummaryArray(matchOne, matchOne.player2).subscribe(data => {

            expect(data.length).toEqual(4);
            expect(data[0]).toEqual(playerTwo);
            expect(data[1]).toEqual(playerOne);
            expect(data[2]).toEqual('1 - 4');
            expect(data[3]).toBeTruthy();
        });

        expect(getPlayerSpy).toHaveBeenCalledTimes(2);
    });

    it('getShortSummaryArray() should display "N/A" as name for invalid players', () => {

        summary.getShortSummaryArray(matchTwo, matchTwo.player1).subscribe(data => {

            expect(data.length).toEqual(4);
            expect(data[0]).toEqual(null);
            expect(data[1]).toEqual(playerTwo);
            expect(data[2]).toEqual('4 - 1');
            expect(data[3]).toBeTruthy();
        });

        expect(getPlayerSpy).toHaveBeenCalledTimes(2);
    });

    it('getShortSummaryArray() should indicate unstarted match when applicable', () => {

        summary.getShortSummaryArray(matchThree, matchThree.player1).subscribe(data => {

            expect(data.length).toEqual(4);
            expect(data[0]).toEqual(playerOne);
            expect(data[1]).toEqual(playerTwo);
            expect(data[2]).toEqual('0 - 0');
            expect(data[3]).toBeFalsy();
        });

        expect(getPlayerSpy).toHaveBeenCalledTimes(2);
    });

    it('getShortSummaryText() should properly construct summary with valid players', () => {

        summary.getShortSummaryText(matchOne, matchOne.player1).subscribe(data => {

            expect(data).toEqual('John Doe 4 - 1 Jane Doe');
        });

        expect(getPlayerSpy).toHaveBeenCalledTimes(2);
    });

    it('getShortSummaryText() should place player with higher priority on the left', () => {

        summary.getShortSummaryText(matchOne, matchOne.player2).subscribe(data => {

            expect(data).toEqual('Jane Doe 1 - 4 John Doe');
        });

        expect(getPlayerSpy).toHaveBeenCalledTimes(2);
    });

    it('getShortSummaryText() should display "N/A" as name for invalid players', () => {

        summary.getShortSummaryText(matchTwo, matchTwo.player1).subscribe(data => {

            expect(data).toEqual('N/A 4 - 1 Jane Doe');
        });

        expect(getPlayerSpy).toHaveBeenCalledTimes(2);
    });

    it('getShortSummaryText() should indicate unstarted match when applicable', () => {

        summary.getShortSummaryText(matchThree, matchThree.player1).subscribe(data => {

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
