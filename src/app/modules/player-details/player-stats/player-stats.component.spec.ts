import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { IPlayer } from '../../data-providers/players-data/player.interface';
import { queryByCss } from '../../../../testing/custom-test-utilities';
import { PlayerLookupService } from '../../data-providers/players-data/player-lookup.service';
import { PlayerStatisticsCalculatorService } from '../../data-providers/players-data/player-statistics-calculator.service';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PlayerStatsComponent } from './player-stats.component';

describe('PlayerStatsComponent', () => {

    const currentYear = new Date().getFullYear();

    const active = <IPlayer>{

        id: 293,
        turnedPro: 2016,
        lastSeasonPlayed: currentYear
    };

    const retired = <IPlayer>{

        id: 130,
        turnedPro: 2017,
        lastSeasonPlayed: currentYear - 1
    };

    let fixture: ComponentFixture<PlayerStatsComponent>;
    let component: PlayerStatsComponent;
    let routes: ActivatedRoute;
    let routesParentSpy: jasmine.Spy;
    let playerLookup: jasmine.SpyObj<PlayerLookupService>;
    let getPlayerSpy: jasmine.Spy;
    let statistics: jasmine.SpyObj<PlayerStatisticsCalculatorService>;
    let getCurrentRankSpy: jasmine.Spy;
    let getHighestRankSpy: jasmine.Spy;
    let getLowestRankSpy: jasmine.Spy;
    let getTotalEarningSpy: jasmine.Spy;
    const totalEarning = 1300;
    const currentRanking = 5;
    const highestRanking = 2;
    const lowestRanking = 9;

    beforeEach(async(() => {

        setupPlayerLookup(active.id);
        setupStatsCalculator(currentRanking, highestRanking, lowestRanking);

        TestBed.configureTestingModule({

            imports: [

                RouterTestingModule,
                MatListModule,
                MatProgressSpinnerModule
            ],
            declarations: [PlayerStatsComponent],
            providers: [

                { provide: PlayerLookupService, useValue: playerLookup },
                { provide: PlayerStatisticsCalculatorService, useValue: statistics }
            ]

        }).compileComponents();

        routes = TestBed.get(ActivatedRoute);
        routesParentSpy = spyOnProperty(routes, 'parent');
        setupParamMapSpy({ id : active.id });
    }));

    beforeEach(() => {

        fixture = TestBed.createComponent(PlayerStatsComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {

        expect(component).toBeTruthy();
    });

    it('should retrieve player object with the help of parent paramMap', () => {

        expect(component.player).toBeNull();

        fixture.detectChanges();

        expect(component.player).toEqual(active);
        expect(getPlayerSpy).toHaveBeenCalledTimes(1);
    });

    it('should be unable to retrieve player object with missing parent parameter', () => {

        setupParamMapSpy({ foo: 1 });
        expect(component.player).toBeNull();

        fixture.detectChanges();

        expect(component.player).toBeNull();
        expect(getPlayerSpy).toHaveBeenCalledTimes(1);
    });

    it('should properly set ranking data when player is available', () => {

        expect(component.careerEarning).toBeUndefined();
        expect(component.currentRank).toBeUndefined();
        expect(component.highestRank).toBeUndefined();
        expect(component.lowestRank).toBeUndefined();

        fixture.detectChanges();

        expect(component.careerEarning).toEqual(totalEarning);
        expect(component.currentRank).toEqual(currentRanking);
        expect(component.highestRank).toEqual(highestRanking);
        expect(component.lowestRank).toEqual(lowestRanking);

        expect(getTotalEarningSpy).toHaveBeenCalledTimes(1);
        expect(getCurrentRankSpy).toHaveBeenCalledTimes(1);
        expect(getHighestRankSpy).toHaveBeenCalledTimes(1);
        expect(getLowestRankSpy).toHaveBeenCalledTimes(1);
    });

    it('should properly display player statistics on page', () => {

        fixture.detectChanges();

        compareText('.status', 'Active');
        compareText('.turnedPro', `${active.turnedPro}`);
        compareText('.lastSeason', `${active.lastSeasonPlayed}`);
        compareText('.earnings', `${component.careerEarning}`);
        compareText('.currentRank', `${component.currentRank}`);
        compareText('.highestRank', `${component.highestRank}`);
        compareText('.lowestRank', `${component.lowestRank}`);
    });

    it('should properly display status for retired player', () => {

        getPlayerSpy.and.returnValue(of(retired));
        fixture.detectChanges();

        compareText('.status', 'Retired');
    });

    function setupPlayerLookup(expectedId: number): void {

        playerLookup = jasmine.createSpyObj('PlayerLookupService', ['getPlayer']);

        getPlayerSpy = playerLookup.getPlayer.and.callFake(targetId => {

            return of(targetId === expectedId ? active : null);
        });
    }

    function setupStatsCalculator(currentRank: number, highestRank: number, lowestRank: number): void {

        statistics = jasmine.createSpyObj(

            'PlayerStatisticsCalculatorService',
            ['getTotalEarning', 'getCurrentRank', 'getHighestRank', 'getLowestRank']
        );

        getTotalEarningSpy = statistics.getTotalEarning.and.returnValue(of(totalEarning));
        getCurrentRankSpy = statistics.getCurrentRank.and.returnValue(of(currentRank));
        getHighestRankSpy = statistics.getHighestRank.and.returnValue(of(highestRank));
        getLowestRankSpy = statistics.getLowestRank.and.returnValue(of(lowestRank));
    }

    function setupParamMapSpy(map: object): void {

        const parent = new ActivatedRoute();
        routesParentSpy.and.returnValue(parent);

        const paramMap$ = of(convertToParamMap(map));
        spyOnProperty(parent, 'paramMap').and.returnValue(paramMap$);
    }

    function compareText(css: string, expected: string): void {

        const element = queryByCss(fixture.debugElement, css);
        expect(element.nativeElement.textContent).toEqual(expected);
    }
});
