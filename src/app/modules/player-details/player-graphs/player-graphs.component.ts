import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
    selector: 'app-player-graphs',
    templateUrl: './player-graphs.component.html',
    styleUrls: ['./player-graphs.component.css']
})
export class PlayerGraphsComponent implements OnInit {

    private _rankChart: Chart;
    private _moneyChart: Chart;

    constructor() { }

    ngOnInit() {

        const timeout = setTimeout(() => {

            this._rankChart = this.createLineChart(

                'rankChart',
                'World Ranking per Year',
                ['2013', '2014', '2015', '2016', '2017', '2018'],
                [3, 7, 9, 6, 2, 4],
                { r: 23, g: 190, b: 209 }
            );

            this._moneyChart = this.createLineChart(

                'moneyChart',
                'Earnings per Year',
                ['2013', '2014', '2015', '2016', '2017', '2018'],
                [100, 200, 250, 175, 300, 310],
                { r: 255, g: 99, b: 132 }
            );

            clearTimeout(timeout);
        });
    }

    private getRgbaColor(rgb: { r, g, b }, alpha: number = 1): string {

        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
    }

    private createLineChart(

        canvasId: string,
        title: string,
        labels: string[],
        values: number[],
        rgb: { r, g, b }

    ): Chart {

        return new Chart(canvasId, {

            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: title,
                    data: values,
                    backgroundColor: [this.getRgbaColor(rgb, 0.2)],
                    borderColor: [this.getRgbaColor(rgb)],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        stacked: true
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
}
