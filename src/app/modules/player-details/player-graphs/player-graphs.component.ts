import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IGridChartData } from '../../../shared/services/gridChartData.interface';
import { PlayerStatisticsCalculatorService } from '../../data-providers/players-data/player-statistics-calculator.service';
import { BarChartFactoryService } from '../../../shared/services/bar-chart-factory.service';
import { LineChartFactoryService } from '../../../shared/services/line-chart-factory.service';

@Component({
    selector: 'app-player-graphs',
    templateUrl: './player-graphs.component.html',
    styleUrls: ['./player-graphs.component.css']
})
export class PlayerGraphsComponent implements OnInit {

    private _id: number;
    private _chartTitle: string;
    private _activeChart: Chart;
    private _rankingChartTitle = 'World Ranking';
    private _earningChartTitle = 'Earnings';

    constructor(

        private routes: ActivatedRoute,
        private statistics: PlayerStatisticsCalculatorService,
        private barChartFactory: BarChartFactoryService,
        private lineChartFactory: LineChartFactoryService

    ) { }

    get chartTitle(): string {

        return this._chartTitle;
    }

    ngOnInit() {

        this.routes.parent.paramMap.subscribe(paramMap => {

            this._id = Number(paramMap.get('id'));
            this.loadRankingChart();
        });
    }

    private loadRankingChart(): void {

        this.statistics.getRankHistory(this._id).subscribe(rankings => {

            this.lineChartFactory.clear(this._activeChart);
            this._chartTitle = this._rankingChartTitle;

            this._activeChart = this.lineChartFactory.create(<IGridChartData>{

                canvas: 'canvas',
                title: 'World Ranking per Year',
                labels: this.statistics.supportedYears.map(year => `${year}`),
                values: rankings.map(ranking => ranking.rank),
                mainRgb: { r: 23, g: 190, b: 209 },
                gridRgb: { r: 86, g: 89, b: 94}
            });
        });
    }

    private loadEarningChart(): void {

        this.statistics.getEarningHistory(this._id).subscribe(earnings => {

            this.barChartFactory.clear(this._activeChart);
            this._chartTitle = this._earningChartTitle;

            this._activeChart = this.barChartFactory.create(<IGridChartData>{

                canvas: 'canvas',
                title: 'Earnings per Year',
                labels: this.statistics.supportedYears.map(year => `${year}`),
                values: earnings.map(earning => earning.earning),
                mainRgb: { r: 255, g: 99, b: 132 },
                gridRgb: { r: 86, g: 89, b: 94}
            });
        });
    }

    public toggleChart(): void {

        if (this._chartTitle === this._rankingChartTitle) {

            this.loadEarningChart();

            return;
        }

        this.loadRankingChart();
    }
}
