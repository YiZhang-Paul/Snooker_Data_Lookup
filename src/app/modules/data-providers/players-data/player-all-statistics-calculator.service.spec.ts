import { TestBed, inject } from '@angular/core/testing';
import { of } from 'rxjs';
import { IPlayer } from './player.interface';
import { IGroupValue } from './group-value.interface';
import { PlayerLookupService } from './player-lookup.service';
import { PlayerStatisticsCalculatorService } from './player-statistics-calculator.service';
import { PlayerAllStatisticsCalculatorService } from './player-all-statistics-calculator.service';

describe('PlayerAllStatisticsCalculatorService', () => {

    const currentYear = new Date().getFullYear();

    const players: IPlayer[] = [

        {
            id: 293,
            firstName: 'John',
            middleName: 'K',
            lastName: 'Doe',
            shortName: 'John Doe',
            dateOfBirth: `${currentYear - 20}-12-12`,
            sex: 'M',
            nationality: 'three-body',
            photo: 'photo.jpg',
            bioPage: 'bio.com',
            website: 'site.com',
            twitter: '@kDoe',
            turnedPro: 2013,
            lastSeasonPlayed: currentYear - 3
        },
        {
            id: 130,
            firstName: 'Jane',
            middleName: '',
            lastName: 'Doe',
            shortName: 'Jane Doe',
            dateOfBirth: `${currentYear - 17}-04-17`,
            sex: 'F',
            nationality: 'three-body',
            photo: 'photo.jpg',
            bioPage: 'bio.com',
            website: 'site.com',
            twitter: '@NDoe',
            turnedPro: 2012,
            lastSeasonPlayed: currentYear
        },
        {
            id: 15,
            firstName: 'Jim',
            middleName: '',
            lastName: 'Moe',
            shortName: 'Jim Moe',
            dateOfBirth: `${currentYear - 40}-08-25`,
            sex: 'M',
            nationality: 'china',
            photo: 'photo.jpg',
            bioPage: 'bio.com',
            website: 'site.com',
            twitter: '@Moe',
            turnedPro: 2009,
            lastSeasonPlayed: currentYear
        }
    ];

    let lookup: PlayerLookupService;
    let players$Spy: jasmine.Spy;
    let getPlayersSpy: jasmine.Spy;
    let playerStatistics: jasmine.SpyObj<PlayerStatisticsCalculatorService>;
    let getTotalEarningSpy: jasmine.Spy;
    let allStatistics: PlayerAllStatisticsCalculatorService;

    beforeEach(() => {

        setupPlayerLookup();
        setupStatisticsCalculator();

        TestBed.configureTestingModule({

            providers: [

                PlayerAllStatisticsCalculatorService,
                { provide: PlayerLookupService, useValue: lookup },
                { provide: PlayerStatisticsCalculatorService, useValue: playerStatistics }
            ]
        });

        allStatistics = TestBed.get(PlayerAllStatisticsCalculatorService);
    });

    it('should be created', inject([PlayerAllStatisticsCalculatorService], (service: PlayerAllStatisticsCalculatorService) => {

        expect(service).toBeTruthy();
    }));

    it('should calculate percentage by age for all players', () => {

        allStatistics.groupByAge(-1).subscribe(data => {

            expect(data.length).toEqual(players.length);

            compareGroupValue(data[0], 10, 1, 1 / 3);
            compareGroupValue(data[1], 20, 1, 1 / 3);
            compareGroupValue(data[2], 40, 1, 1 / 3);
        });

        expect(players$Spy).toHaveBeenCalledTimes(1);
    });

    it('should calculate percentage by age for players in selected year', () => {

        allStatistics.groupByAge(currentYear).subscribe(data => {

            expect(data.length).toEqual(2);

            compareGroupValue(data[0], 10, 1, 1 / 2);
            compareGroupValue(data[1], 40, 1, 1 / 2);
        });

        expect(getPlayersSpy).toHaveBeenCalledTimes(1);
    });

    it('should calculate percentage by nationality for all players', () => {

        allStatistics.groupByNationality(-1).subscribe(data => {

            expect(data.length).toEqual(2);

            compareGroupValue(data[0], 'china', 1, 1 / 3);
            compareGroupValue(data[1], 'three-body', 2, 2 / 3);
        });

        expect(players$Spy).toHaveBeenCalledTimes(1);
    });

    it('should calculate percentage by nationality for players in selected year', () => {

        allStatistics.groupByNationality(currentYear).subscribe(data => {

            expect(data.length).toEqual(2);

            compareGroupValue(data[0], 'china', 1, 1 / 2);
            compareGroupValue(data[1], 'three-body', 1, 1 / 2);
        });

        expect(getPlayersSpy).toHaveBeenCalledTimes(1);
    });

    it('should calculate percentage by status for all players', () => {

        allStatistics.groupByRetired(-1).subscribe(data => {

            expect(data.length).toEqual(2);

            compareGroupValue(data[0], false, 1, 1 / 3);
            compareGroupValue(data[1], true, 2, 2 / 3);
        });

        expect(players$Spy).toHaveBeenCalledTimes(1);
    });

    it('should calculate percentage by status for players in selected year', () => {

        allStatistics.groupByRetired(currentYear).subscribe(data => {

            expect(data.length).toEqual(1);

            compareGroupValue(data[0], true, 2, 1);
        });

        expect(getPlayersSpy).toHaveBeenCalledTimes(1);
    });

    it('should calculate percentage by earnings for all players', () => {

        allStatistics.groupByEarnings(-1).subscribe(data => {

            expect(data.length).toEqual(players.length);

            compareGroupValue(data[0], 0, 1, 1 / 3);
            compareGroupValue(data[1], 400000, 1, 1 / 3);
            compareGroupValue(data[2], 1200000, 1, 1 / 3);
        });

        expect(players$Spy).toHaveBeenCalledTimes(1);
        expect(getTotalEarningSpy).toHaveBeenCalledTimes(players.length);
    });

    it('should calculate percentage by earnings for players in selected year', () => {

        allStatistics.groupByEarnings(currentYear).subscribe(data => {

            expect(data.length).toEqual(2);

            compareGroupValue(data[0], 400000, 1, 1 / 2);
            compareGroupValue(data[1], 1200000, 1, 1 / 2);
        });

        expect(getPlayersSpy).toHaveBeenCalledTimes(1);
        expect(getTotalEarningSpy).toHaveBeenCalledTimes(2);
    });

    function toMap(input: IPlayer[]): Map<number, IPlayer> {

        const map = new Map<number, IPlayer>();

        input.forEach(player => {

            map.set(player.id, player);
        });

        return map;
    }

    function setupPlayerLookup(): void {

        lookup = new PlayerLookupService(null);
        players$Spy = spyOnProperty(lookup, 'players$').and.returnValue(of(toMap(players)));

        getPlayersSpy = spyOn(lookup, 'getPlayers').and.callFake(targetYear => {

            const result = targetYear === currentYear ? players.slice(1) : players.slice(0, 1);

            return of(toMap(result));
        });
    }

    function setupStatisticsCalculator(): void {

        playerStatistics = jasmine.createSpyObj('PlayerStatisticsCalculatorService', ['getTotalEarning']);

        getTotalEarningSpy = playerStatistics.getTotalEarning.and.callFake(targetId => {

            if (targetId === players[0].id) {

                return of(200000);
            }

            return of(targetId === players[1].id ? 600000 : 1200000);
        });
    }

    function compareGroupValue<T>(value: IGroupValue<T>, key: T, size: number, percentage: number): void {

        expect(value.key).toEqual(key);
        expect(value.size).toEqual(size);
        expect(value.percentage).toEqual(percentage);
    }
});
