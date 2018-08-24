import { TestBed, inject } from '@angular/core/testing';
import { of } from 'rxjs';
import { IPlayer } from './player.interface';
import { IRankData } from '../rankings-data/rank-data.interface';
import { RankingLookupService } from '../rankings-data/ranking-lookup.service';
import { PlayerStatisticsCalculatorService } from './player-statistics-calculator.service';

describe('PlayerStatisticsCalculatorService', () => {

    const currentYear = new Date().getFullYear();
    // ranks for active player
    const highestRank = 2;
    const lowestRank = 7;
    const currentRank = 4;
    // rank for retired player
    const retiredRank = 100;

    const active: IPlayer = {

        id: 207,
        firstName: 'John',
        middleName: 'M',
        lastName: 'Doe',
        shortName: 'John Doe',
        dateOfBirth: '1992-03-01',
        sex: 'M',
        nationality: 'three-body',
        photo: '',
        bioPage: '',
        website: '',
        twitter: '',
        turnedPro: 2016,
        lastSeasonPlayed: currentYear
    };

    const retired: IPlayer = {

        id: 147,
        firstName: 'Jane',
        middleName: '',
        lastName: 'Doe',
        shortName: 'Jane Doe',
        dateOfBirth: '1996-12-25',
        sex: 'F',
        nationality: 'three-body',
        photo: '',
        bioPage: '',
        website: '',
        twitter: '',
        turnedPro: 2016,
        lastSeasonPlayed: currentYear - 1
    };

    const rankings: { [year: number]: IRankData[] } = {

        [currentYear - 3]: [{ position: highestRank, playerId: active.id, earnings: 1, type: 'm' }],
        [currentYear - 2]: [{ position: lowestRank, playerId: active.id, earnings: 2, type: 'm' }],
        // active player not included in this year
        [currentYear - 1]: [{ position: retiredRank, playerId: retired.id, earnings: 1, type: 'm' }],
        [currentYear - 0]: [{ position: currentRank, playerId: active.id, earnings: 3, type: 'm' }]
    };

    let rankingLookup: jasmine.SpyObj<RankingLookupService>;
    let getRankingsSpy: jasmine.Spy;
    let calculator: PlayerStatisticsCalculatorService;

    beforeEach(() => {

        rankingLookup = jasmine.createSpyObj('RankingLookupService', ['getRankings']);

        getRankingsSpy = rankingLookup.getRankings.and.callFake(targetYear => {

            return of(rankings[targetYear] ? rankings[targetYear] : null);
        });

        TestBed.configureTestingModule({

            providers: [

                PlayerStatisticsCalculatorService,
                { provide: RankingLookupService, useValue: rankingLookup }
            ]
        });

        calculator = TestBed.get(PlayerStatisticsCalculatorService);
    });

    it('should be created', inject([PlayerStatisticsCalculatorService], (service: PlayerStatisticsCalculatorService) => {

        expect(service).toBeTruthy();
    }));

    it('current ranking should be null when player is retired', () => {

        calculator.getCurrentRanking(retired.id).subscribe(data => {

            expect(data).toBeNull();
        });

        expect(getRankingsSpy).toHaveBeenCalledTimes(1);
    });

    it('current ranking should be null when rankings for current year are not available', () => {

        rankingLookup.getRankings.and.callFake(targetYear => {

            const hasValue = targetYear !== currentYear && rankings[targetYear];

            return of(hasValue ? rankings[targetYear] : null);
        });

        calculator.getCurrentRanking(active.id).subscribe(data => {

            expect(data).toBeNull();
        });

        expect(getRankingsSpy).toHaveBeenCalledTimes(1);
    });

    it('should return current ranking when possible', () => {

        calculator.getCurrentRanking(active.id).subscribe(data => {

            expect(data).toEqual(currentRank);
        });

        expect(getRankingsSpy).toHaveBeenCalledTimes(1);
    });

    it('lowest ranking should be null when player is never ranked', () => {

        const fictitiousId = active.id + retired.id + 1;

        calculator.getLowestRanking(fictitiousId).subscribe(data => {

            expect(data).toBeNull();
        });

        checkGetRankingsSpy();
    });

    it('should calculate lowest ranking when possible', () => {

        calculator.getLowestRanking(active.id).subscribe(data => {

            expect(data).toEqual(lowestRank);
        });

        calculator.getLowestRanking(retired.id).subscribe(data => {

            expect(data).toEqual(retiredRank);
        });

        checkGetRankingsSpy();
    });

    it('highest ranking should be null when player is never ranked', () => {

        const fictitiousId = active.id + retired.id + 1;

        calculator.getHighestRanking(fictitiousId).subscribe(data => {

            expect(data).toBeNull();
        });

        checkGetRankingsSpy();
    });

    it('should calculate highest ranking when possible', () => {

        calculator.getHighestRanking(active.id).subscribe(data => {

            expect(data).toEqual(highestRank);
        });

        calculator.getHighestRanking(retired.id).subscribe(data => {

            expect(data).toEqual(retiredRank);
        });

        checkGetRankingsSpy();
    });

    function checkGetRankingsSpy(): void {

        for (let i = 0; i < Object.keys(rankings).length; i++) {

            expect(getRankingsSpy).toHaveBeenCalledWith(currentYear - i);
        }
    }
});
