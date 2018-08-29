import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { of } from 'rxjs';
import { queryAllByCss } from '../../../../testing/custom-test-utilities';
import { PlayerAllStatisticsCalculatorService } from '../../data-providers/players-data/player-all-statistics-calculator.service';
import { DoughnutChartFactoryService } from '../../../shared/services/doughnut-chart-factory.service';
import { PlayerAllStatsComponent } from './player-all-stats.component';
import { startYear } from '../../../app-config';

describe('PlayerAllStatsComponent', () => {

    let fixture: ComponentFixture<PlayerAllStatsComponent>;
    let component: PlayerAllStatsComponent;
    let statistics: jasmine.SpyObj<PlayerAllStatisticsCalculatorService>;
    let groupByNationalitySpy: jasmine.Spy;
    let groupByAgeSpy: jasmine.Spy;
    let groupByStatusSpy: jasmine.Spy;
    let groupByEarningsSpy: jasmine.Spy;
    let chartFactory: jasmine.SpyObj<DoughnutChartFactoryService>;
    let clearChartSpy: jasmine.Spy;
    let createChartSpy: jasmine.Spy;

    beforeEach(async(() => {

        setupAllStatisticsCalculator();
        setupDoughnutChartFactory();

        TestBed.configureTestingModule({

            declarations: [PlayerAllStatsComponent],
            providers: [

                { provide: PlayerAllStatisticsCalculatorService, useValue: statistics },
                { provide: DoughnutChartFactoryService, useValue: chartFactory }
            ]

        }).compileComponents();
    }));

    beforeEach(() => {

        fixture = TestBed.createComponent(PlayerAllStatsComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {

        expect(component).toBeTruthy();
    });

    it('should populate year options', () => {

        fixture.detectChanges();

        const options = queryAllByCss(fixture.debugElement, '.years option');
        const totalYears = new Date().getFullYear() - startYear + 1;

        expect(options.length).toEqual(totalYears + 1);
        compareText(options[0], 'All');

        for (let i = 1; i < options.length; i++) {

            compareText(options[i], `${startYear + (i - 1)}`);
        }
    });

    it('should create all charts on page load', () => {

        fixture.detectChanges();

        expect(groupByNationalitySpy).toHaveBeenCalledTimes(1);
        expect(groupByAgeSpy).toHaveBeenCalledTimes(1);
        expect(groupByStatusSpy).toHaveBeenCalledTimes(1);
        expect(groupByEarningsSpy).toHaveBeenCalledTimes(1);

        expect(clearChartSpy).toHaveBeenCalledTimes(4);
        expect(createChartSpy).toHaveBeenCalledTimes(4);
    });

    it('should load charts for selected year', () => {

        expect(component.selectedYear).not.toEqual(2015);

        component.onYearSelected('2015');

        expect(component.selectedYear).toEqual(2015);
        expect(clearChartSpy).toHaveBeenCalledTimes(4);
        expect(createChartSpy).toHaveBeenCalledTimes(4);
    });

    function setupAllStatisticsCalculator(): void {

        statistics = jasmine.createSpyObj(

            'PlayerAllStatisticsCalculatorService',
            ['groupByNationality', 'groupByAge', 'groupByStatus', 'groupByEarnings']
        );

        groupByNationalitySpy = statistics.groupByNationality.and.returnValue(of([]));
        groupByAgeSpy = statistics.groupByAge.and.returnValue(of([]));
        groupByStatusSpy = statistics.groupByStatus.and.returnValue(of([]));
        groupByEarningsSpy = statistics.groupByEarnings.and.returnValue(of([]));
    }

    function setupDoughnutChartFactory(): void {

        chartFactory = jasmine.createSpyObj(

            'DoughnutChartFactoryService', ['clear', 'create']
        );

        clearChartSpy = chartFactory.clear;
        createChartSpy = chartFactory.create;
    }

    function compareText(debugElement: DebugElement, expected: string): void {

        expect(debugElement.nativeElement.textContent).toEqual(expected);
    }
});
