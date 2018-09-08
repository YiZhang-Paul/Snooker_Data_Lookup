import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { PlayerStatisticsCalculatorService } from '../../data-providers/players-data/player-statistics-calculator.service';
import { LineChartFactoryService } from '../../../shared/services/line-chart-factory.service';
import { BarChartFactoryService } from '../../../shared/services/bar-chart-factory.service';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PlayerGraphsComponent } from './player-graphs.component';

describe('PlayerGraphsComponent', () => {

    let fixture: ComponentFixture<PlayerGraphsComponent>;
    let component: PlayerGraphsComponent;
    let routes: ActivatedRoute;
    let routesParentSpy: jasmine.Spy;
    let statistics: PlayerStatisticsCalculatorService;
    let getRankHistorySpy: jasmine.Spy;
    let getEarningHistorySpy: jasmine.Spy;
    let lineChartFactory: jasmine.SpyObj<LineChartFactoryService>;
    let lineChartClearSpy: jasmine.Spy;
    let lineChartCreateSpy: jasmine.Spy;
    let barChartFactory: jasmine.SpyObj<BarChartFactoryService>;
    let barChartClearSpy: jasmine.Spy;
    let barChartCreateSpy: jasmine.Spy;
    const id = 35;

    beforeEach(async(() => {

        setupStatisticsCalculator();
        setupLineChartFactory();
        setupBarChartFactory();

        TestBed.configureTestingModule({

            imports: [

                RouterTestingModule,
                MatButtonToggleModule,
                MatProgressSpinnerModule
            ],
            declarations: [PlayerGraphsComponent],
            providers: [

                { provide: PlayerStatisticsCalculatorService, useValue: statistics },
                { provide: LineChartFactoryService, useValue: lineChartFactory },
                { provide: BarChartFactoryService, useValue: barChartFactory }
            ]

        }).compileComponents();

        routes = TestBed.get(ActivatedRoute);
        routesParentSpy = spyOnProperty(routes, 'parent');
        setupRoutesParentParamMap({ id });
    }));

    beforeEach(() => {

        fixture = TestBed.createComponent(PlayerGraphsComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {

        expect(component).toBeTruthy();
    });

    it('should retrieve id from parent route paramMap', () => {

        fixture.detectChanges();

        expect(getRankHistorySpy).toHaveBeenCalledTimes(1);
        expect(getRankHistorySpy).toHaveBeenCalledWith(id);
        expect(getEarningHistorySpy).toHaveBeenCalledTimes(1);
        expect(getEarningHistorySpy).toHaveBeenCalledWith(id);
    });

    it('should not retrieve player statistics when parent route paramMap is missing id property', () => {

        setupRoutesParentParamMap({ foo: 1 });

        fixture.detectChanges();

        expect(getRankHistorySpy).toHaveBeenCalledTimes(1);
        expect(getRankHistorySpy).toHaveBeenCalledWith(0);
        expect(getEarningHistorySpy).toHaveBeenCalledTimes(1);
        expect(getEarningHistorySpy).toHaveBeenCalledWith(0);
    });

    it('should load both charts on default', () => {

        fixture.detectChanges();

        expect(getRankHistorySpy).toHaveBeenCalledTimes(1);
        expect(lineChartClearSpy).toHaveBeenCalledTimes(1);
        expect(lineChartCreateSpy).toHaveBeenCalledTimes(1);

        expect(getEarningHistorySpy).toHaveBeenCalledTimes(1);
        expect(barChartClearSpy).toHaveBeenCalledTimes(1);
        expect(barChartCreateSpy).toHaveBeenCalledTimes(1);
    });

    function setupStatisticsCalculator(): void {

        statistics = new PlayerStatisticsCalculatorService(null, null);
        spyOnProperty(statistics, 'supportedYears').and.returnValue([]);
        getRankHistorySpy = spyOn(statistics, 'getRankHistory').and.returnValue(of([]));
        getEarningHistorySpy = spyOn(statistics, 'getEarningHistory').and.returnValue(of([]));
    }

    function setupLineChartFactory(): void {

        lineChartFactory = jasmine.createSpyObj(

            'LineChartFactoryService', ['clear', 'create']
        );

        lineChartClearSpy = lineChartFactory.clear;
        lineChartCreateSpy = lineChartFactory.create;
    }

    function setupBarChartFactory(): void {

        barChartFactory = jasmine.createSpyObj(

            'BarChartFactoryService', ['clear', 'create']
        );

        barChartClearSpy = barChartFactory.clear;
        barChartCreateSpy = barChartFactory.create;
    }

    function setupRoutesParentParamMap(data: object): void {

        const parent = new ActivatedRoute();
        routesParentSpy.and.returnValue(parent);

        const paramMap = of(convertToParamMap(data));
        spyOnProperty(parent, 'paramMap').and.returnValue(paramMap);
    }
});
