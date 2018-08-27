import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { PlayerStatisticsCalculatorService } from '../../data-providers/players-data/player-statistics-calculator.service';
import { PlayerGraphsComponent } from './player-graphs.component';

describe('PlayerGraphsComponent', () => {

    let component: PlayerGraphsComponent;
    let fixture: ComponentFixture<PlayerGraphsComponent>;
    let routes: ActivatedRoute;
    let routesParentSpy: jasmine.Spy;
    let statistics: PlayerStatisticsCalculatorService;
    let getRankHistorySpy: jasmine.Spy;
    const id = 35;

    beforeEach(async(() => {

        setupStatisticsCalculator();

        TestBed.configureTestingModule({

            imports: [RouterTestingModule],
            declarations: [PlayerGraphsComponent],
            providers: [

                { provide: PlayerStatisticsCalculatorService, useValue: statistics }
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
    });

    it('should not retrieve player statistics when parent route paramMap is missing id property', () => {

        setupRoutesParentParamMap({ foo: 1 });

        fixture.detectChanges();

        expect(getRankHistorySpy).toHaveBeenCalledTimes(1);
        expect(getRankHistorySpy).toHaveBeenCalledWith(0);
    });

    it('should display ranking chart on default', () => {

        expect(component.chartTitle).not.toEqual('World Ranking');

        fixture.detectChanges();

        expect(component.chartTitle).toEqual('World Ranking');
        expect(getRankHistorySpy).toHaveBeenCalledTimes(1);
    });

    it('should toggle charts', () => {

        fixture.detectChanges();
        expect(component.chartTitle).toEqual('World Ranking');

        component.toggleChart();
        expect(component.chartTitle).toEqual('Earnings');

        component.toggleChart();
        expect(component.chartTitle).toEqual('World Ranking');
    });

    function setupStatisticsCalculator(): void {

        statistics = new PlayerStatisticsCalculatorService(null, null);
        spyOnProperty(statistics, 'supportedYears').and.returnValue([]);
        spyOn(statistics, 'getEarningHistory').and.returnValue(of([]));
        getRankHistorySpy = spyOn(statistics, 'getRankHistory').and.returnValue(of([]));
    }

    function setupRoutesParentParamMap(data: object): void {

        const parent = new ActivatedRoute();
        routesParentSpy.and.returnValue(parent);

        const paramMap = of(convertToParamMap(data));
        spyOnProperty(parent, 'paramMap').and.returnValue(paramMap);
    }
});
