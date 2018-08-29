import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlayerStatisticsCalculatorService } from '../../data-providers/players-data/player-statistics-calculator.service';
import { Chart, ChartDataSets } from 'chart.js';

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
        private statistics: PlayerStatisticsCalculatorService

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

    private getRgbaColor(rgb: { r, g, b }, alpha: number = 1): string {

        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
    }

    private setLineChartColor(set: ChartDataSets, rgb: { r, g, b }): ChartDataSets {

        set.backgroundColor = [this.getRgbaColor(rgb, 0.2)];
        set.borderColor = [this.getRgbaColor(rgb)];

        return set;
    }

    private setBarChartColor(set: ChartDataSets, rgb: { r, g, b }, items: number): ChartDataSets {

        const background = [];
        const border = [];
        const hoverBackground = [];
        const hoverBorder = [];
        const getValue = () => Math.floor(Math.random() * 256);

        for (let i = 0; i < items; i++) {

            const randomRgb = { r: getValue(), g: getValue(), b: getValue() };
            background.push(this.getRgbaColor(randomRgb, 0.2));
            border.push(this.getRgbaColor(randomRgb));
            hoverBackground.push(this.getRgbaColor(rgb, 0.2));
            hoverBorder.push(this.getRgbaColor(rgb));
        }

        set.backgroundColor = background;
        set.borderColor = border;
        set.hoverBackgroundColor = hoverBackground;
        set.hoverBorderColor = hoverBorder;

        return set;
    }

    private clearChart(): void {

        if (this._activeChart) {

            this._activeChart.destroy();
        }
    }

    private createChart(

        canvas: string,
        type: string,
        title: string,
        labels: string[],
        values: number[],
        backgroundRgb: { r, g, b },
        gridRgb: { r, g, b }

    ): Chart {

        const dataset = {
            label: title,
            data: values,
            borderWidth: 1
        };

        return new Chart(canvas, {

            type,
            data: {
                labels,
                datasets: [
                    type === 'line' ?
                        this.setLineChartColor(dataset, backgroundRgb) :
                        this.setBarChartColor(dataset, backgroundRgb, labels.length)
                ]
            },
            options: {
                scales: {
                    xAxes: [{
                        gridLines: {
                            color: this.getRgbaColor(gridRgb, 0.45)
                        }
                    }],
                    yAxes: [{
                        stacked: true,
                        ticks: {
                            callback: value => { if (Number.isInteger(value)) { return value; } }
                        },
                        gridLines: {
                            color: this.getRgbaColor(gridRgb, 0.7)
                        }
                    }]
                },
                elements: {
                    line: {
                        tension: 0
                    }
                }
            }
        });
    }

    private loadRankingChart(): void {

        this.statistics.getRankHistory(this._id).subscribe(rankings => {

            this.clearChart();
            this._chartTitle = this._rankingChartTitle;

            this._activeChart = this.createChart(

                'canvas', 'line', 'World Ranking per Year',
                this.statistics.supportedYears.map(year => String(year)),
                rankings.map(ranking => ranking.rank),
                { r: 23, g: 190, b: 209 },
                { r: 86, g: 89, b: 94}
            );
        });
    }

    private loadEarningChart(): void {

        this.statistics.getEarningHistory(this._id).subscribe(earnings => {

            this.clearChart();
            this._chartTitle = this._earningChartTitle;

            this._activeChart = this.createChart(

                'canvas', 'bar', 'Earnings per Year',
                this.statistics.supportedYears.map(year => String(year)),
                earnings.map(earning => earning.earning),
                { r: 255, g: 99, b: 132 },
                { r: 86, g: 89, b: 94}
            );
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
