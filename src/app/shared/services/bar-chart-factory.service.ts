import { Injectable } from '@angular/core';
import { IGridChartData } from './gridChartData.interface';
import { ChartFactory } from './chartFactory';
import { ChartDataSets, ChartOptions } from 'chart.js';

@Injectable({
    providedIn: 'root'
})
export class BarChartFactoryService extends ChartFactory {

    constructor() {

        super('bar');
    }

    protected configureDataSet(data: IGridChartData): ChartDataSets {

        const dataSet: ChartDataSets = {

            label: data.title,
            data: data.values,
            borderWidth: 1
        };

        return this.setColor(dataSet, data.mainRgb, data.labels.length);
    }

    protected configureOptions(data: IGridChartData): ChartOptions {

        const xAxes = [{

            gridLines: { color: this.getColor(data.gridRgb, 0.45) }
        }];

        const callback = x => { if (Number.isInteger(x)) { return x; } };

        const yAxes = [{

            stacked: true,
            ticks: { callback },
            gridLines: { color: this.getColor(data.gridRgb, 0.7) }
        }];

        return <ChartOptions>{

            scales: { xAxes, yAxes },
            elements: { line: { tension: 0 } }
        };
    }
}
