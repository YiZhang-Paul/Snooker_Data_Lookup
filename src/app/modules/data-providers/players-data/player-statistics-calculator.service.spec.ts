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
        lastSeasonPlayed: currentYear // not retired
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
        lastSeasonPlayed: currentYear - 1 // retired
    };

    const rankings: { [year: number]: IRankData[] } = {

        [currentYear - 3]: [{ position: highestRank, playerId: active.id, earnings: 100, type: 'm' }],
        [currentYear - 2]: [{ position: lowestRank, playerId: active.id, earnings: 150, type: 'm' }],
        // active player not included in this year
        [currentYear - 1]: [{ position: retiredRank, playerId: retired.id, earnings: 200, type: 'm' }],
        [currentYear - 0]: [{ position: currentRank, playerId: active.id, earnings: 50, type: 'm' }]
    };

    let lookup: jasmine.SpyObj<RankingLookupService>;
    let getRankingsSpy: jasmine.Spy;
    let statistics: PlayerStatisticsCalculatorService;

    beforeEach(() => {

        setupRankingLookup();

        TestBed.configureTestingModule({

            providers: [

                PlayerStatisticsCalculatorService,
                { provide: RankingLookupService, useValue: lookup }
            ]
        });

        statistics = TestBed.get(PlayerStatisticsCalculatorService);
    });

    it('should be created', inject([PlayerStatisticsCalculatorService], (service: PlayerStatisticsCalculatorService) => {

        expect(service).toBeTruthy();
    }));

    it('current ranking should be null when player is retired', () => {

        statistics.getCurrentRanking(retired.id).subscribe(data => {

            expect(data).toBeNull();
        });

        expect(getRankingsSpy).toHaveBeenCalledTimes(1);
    });

    it('current ranking should be null when rankings for current year are not available', () => {

        lookup.getRankings.and.callFake(targetYear => {

            const isValid = targetYear !== currentYear && rankings[targetYear];

            return of(isValid ? rankings[targetYear] : null);
        });

        statistics.getCurrentRanking(active.id).subscribe(data => {

            expect(data).toBeNull();
        });

        expect(getRankingsSpy).toHaveBeenCalledTimes(1);
    });

    it('should return current ranking when possible', () => {

        statistics.getCurrentRanking(active.id).subscribe(data => {

            expect(data).toEqual(currentRank);
        });

        expect(getRankingsSpy).toHaveBeenCalledTimes(1);
    });

    it('lowest ranking should be null when player is never ranked', () => {

        const fictitiousId = active.id + retired.id + 1;

        statistics.getLowestRanking(fictitiousId).subscribe(data => {

            expect(data).toBeNull();
        });

        checkGetRankingsSpy();
    });

    it('should calculate lowest ranking when possible', () => {

        statistics.getLowestRanking(active.id).subscribe(data => {

            expect(data).toEqual(lowestRank);
        });

        statistics.getLowestRanking(retired.id).subscribe(data => {

            expect(data).toEqual(retiredRank);
        });

        checkGetRankingsSpy();
    });

    it('highest ranking should be null when player is never ranked', () => {

        const fictitiousId = active.id + retired.id + 1;

        statistics.getHighestRanking(fictitiousId).subscribe(data => {

            expect(data).toBeNull();
        });

        checkGetRankingsSpy();
    });

    it('should calculate highest ranking when possible', () => {

        statistics.getHighestRanking(active.id).subscribe(data => {

            expect(data).toEqual(highestRank);
        });

        statistics.getHighestRanking(retired.id).subscribe(data => {

            expect(data).toEqual(retiredRank);
        });

        checkGetRankingsSpy();
    });

    it('should return 0 total earnings for invalid id', () => {

        const fictitiousId = active.id + retired.id + 1;

        statistics.getTotalEarnings(fictitiousId).subscribe(data => {

            expect(data).toEqual(0);
        });

        checkGetRankingsSpy();
    });

    it('should properly calculate total earnings for valid ids', () => {

        const years = [currentYear, currentYear - 2, currentYear - 3];

        const totalEarnings = years.reduce((total, year) => {

            return total + rankings[year][0].earnings;

        }, 0);

        statistics.getTotalEarnings(active.id).subscribe(data => {

            expect(data).toEqual(totalEarnings);
        });

        statistics.getTotalEarnings(retired.id).subscribe(data => {

            expect(data).toEqual(rankings[currentYear - 1][0].earnings);
        });

        checkGetRankingsSpy();
    });

    function setupRankingLookup(): void {

        lookup = jasmine.createSpyObj('RankingLookupService', ['getRankings']);

        getRankingsSpy = lookup.getRankings.and.callFake(targetYear => {

            return of(rankings[targetYear] ? rankings[targetYear] : null);
        });
    }

    function checkGetRankingsSpy(): void {

        for (let i = 0; i < Object.keys(rankings).length; i++) {

            expect(getRankingsSpy).toHaveBeenCalledWith(currentYear - i);
        }
    }
});
