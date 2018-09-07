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
    private _rankingChart: Chart;
    private _earningChart: Chart;

    constructor(

        private routes: ActivatedRoute,
        private statistics: PlayerStatisticsCalculatorService,
        private barChartFactory: BarChartFactoryService,
        private lineChartFactory: LineChartFactoryService

    ) { }

    ngOnInit() {

        this.routes.parent.paramMap.subscribe(paramMap => {

            this._id = Number(paramMap.get('id'));
            this.loadRankingChart('rankingCanvas');
            this.loadEarningChart('earningCanvas');
        });
    }

    private loadRankingChart(canvas: string): void {

        this.statistics.getRankHistory(this._id).subscribe(rankings => {

            this.lineChartFactory.clear(this._rankingChart);

            this._rankingChart = this.lineChartFactory.create(<IGridChartData>{

                canvas,
                title: 'World Ranking per Year',
                labels: this.statistics.supportedYears.map(year => `${year}`),
                values: rankings.map(ranking => ranking.rank),
                mainRgb: { r: 23, g: 190, b: 209 },
                gridRgb: { r: 86, g: 89, b: 94}
            });
        });
    }

    private loadEarningChart(canvas: string): void {

        this.statistics.getEarningHistory(this._id).subscribe(earnings => {

            this.barChartFactory.clear(this._earningChart);

            this._earningChart = this.barChartFactory.create(<IGridChartData>{

                canvas,
                title: 'Earnings per Year',
                labels: this.statistics.supportedYears.map(year => `${year}`),
                values: earnings.map(earning => earning.earning),
                mainRgb: { r: 255, g: 99, b: 132 },
                gridRgb: { r: 86, g: 89, b: 94}
            });
        });
    }
}
