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
    private _chart: string;
    private _activeChart: Chart;
    private _rankingChartTitle = 'World Ranking';
    private _earningChartTitle = 'Earnings';

    constructor(

        private routes: ActivatedRoute,
        private statistics: PlayerStatisticsCalculatorService

    ) { }

    get chart(): string {

        return this._chart;
    }

    ngOnInit() {

        this.routes.parent.paramMap.subscribe(params => {

            this._id = Number(params.get('id'));
            this.showRankingChart();
        });
    }

    private getRgbaColor(rgb: { r, g, b }, alpha: number = 1): string {

        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
    }

    private setLineChartColor(dataset: ChartDataSets, rgb: { r, g, b }): ChartDataSets {

        dataset.backgroundColor = [this.getRgbaColor(rgb, 0.2)];
        dataset.borderColor = [this.getRgbaColor(rgb)];

        return dataset;
    }

    private setBarChartColor(dataset: ChartDataSets, rgb: { r, g, b }, items: number): ChartDataSets {

        const backgroundColor = [];
        const borderColor = [];
        const hoverBackgroundColor = [];
        const hoverBorderColor = [];

        const random = () => Math.floor(Math.random() * 256);

        for (let i = 0; i < items; i++) {

            const randomRgb = { r: random(), g: random(), b: random() };
            backgroundColor.push(this.getRgbaColor(randomRgb, 0.2));
            borderColor.push(this.getRgbaColor(randomRgb));
            hoverBackgroundColor.push(this.getRgbaColor(rgb, 0.2));
            hoverBorderColor.push(this.getRgbaColor(rgb));
        }

        dataset.backgroundColor = backgroundColor;
        dataset.borderColor = borderColor;
        dataset.hoverBackgroundColor = hoverBackgroundColor;
        dataset.hoverBorderColor = hoverBorderColor;

        return dataset;
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
        mainRgb: { r, g, b },
        gridRgb: { r, g, b}

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
                        this.setLineChartColor(dataset, mainRgb) :
                        this.setBarChartColor(dataset, mainRgb, labels.length)
                ]
            },
            options: {
                scales: {
                    xAxes: [{
                        gridLines: {
                            color: this.getRgbaColor(gridRgb, 0.45)
                        },
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

    private showRankingChart(): void {

        this.statistics.getRankHistory(this._id).subscribe(rankings => {

            this.clearChart();
            this._chart = this._rankingChartTitle;

            this._activeChart = this.createChart(

                'canvas',
                'line',
                'World Ranking per Year',
                this.statistics.supportedYears.map(year => String(year)),
                rankings.map(ranking => ranking.rank),
                { r: 23, g: 190, b: 209 },
                { r: 86, g: 89, b: 94}
            );
        });
    }

    private showEarningChart(): void {

        this.statistics.getEarningHistory(this._id).subscribe(earnings => {

            this.clearChart();
            this._chart = this._earningChartTitle;

            this._activeChart = this.createChart(

                'canvas',
                'bar',
                'Earnings per Year',
                this.statistics.supportedYears.map(year => String(year)),
                earnings.map(earning => earning.earning),
                { r: 255, g: 99, b: 132 },
                { r: 86, g: 89, b: 94}
            );
        });
    }

    public toggleChart(): void {

        const isRanking = this._chart === this._rankingChartTitle;
        const chart = isRanking ? this._earningChartTitle : this._rankingChartTitle;

        if (chart === this._earningChartTitle) {

            this.showEarningChart();

            return;
        }

        this.showRankingChart();
    }
}
