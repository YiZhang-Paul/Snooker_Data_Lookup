import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
    selector: 'app-player-graphs',
    templateUrl: './player-graphs.component.html',
    styleUrls: ['./player-graphs.component.css']
})
export class PlayerGraphsComponent implements OnInit {

    private _chart: string;
    private _rankingChartTitle = 'World Ranking';
    private _earningChartTitle = 'Earnings';

    constructor() { }

    get chart(): string {

        return this._chart;
    }

    ngOnInit() {

        const timeout = setTimeout(() => {

            this.showRankingChart();
            this._chart = this._rankingChartTitle;

            clearTimeout(timeout);
        });
    }

    private getRgbaColor(rgb: { r, g, b }, alpha: number = 1): string {

        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
    }

    private createLineChart(

        canvas: string,
        title: string,
        labels: string[],
        values: number[],
        mainRgb: { r, g, b },
        gridRgb: { r, g, b}

    ): Chart {

        return new Chart(canvas, {

            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: title,
                    data: values,
                    backgroundColor: [this.getRgbaColor(mainRgb, 0.2)],
                    borderColor: [this.getRgbaColor(mainRgb)],
                    borderWidth: 1
                }]
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

        this.createLineChart(

            'canvas',
            'World Ranking per Year',
            ['2013', '2014', '2015', '2016', '2017', '2018'],
            [3, 7, 9, 6, 2, 4],
            { r: 23, g: 190, b: 209 },
            { r: 86, g: 89, b: 94}
        );
    }

    private showEarningChart(): void {

        this.createLineChart(

            'canvas',
            'Earnings per Year',
            ['2013', '2014', '2015', '2016', '2017', '2018'],
            [100, 200, 250, 175, 300, 310],
            { r: 255, g: 99, b: 132 },
            { r: 86, g: 89, b: 94}
        );
    }

    public toggleChart(): void {

        const isRanking = this._chart === this._rankingChartTitle;
        this._chart = isRanking ? this._earningChartTitle : this._rankingChartTitle;

        if (this._chart === this._earningChartTitle) {

            this.showEarningChart();

            return;
        }

        this.showRankingChart();
    }
}
