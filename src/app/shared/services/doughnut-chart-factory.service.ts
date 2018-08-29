import { Injectable } from '@angular/core';
import { IChartData } from './chartData.interface';
import { ChartFactory } from './chartFactory';
import { ChartDataSets, ChartOptions, ChartTooltipItem, ChartData } from 'chart.js';

@Injectable({
    providedIn: 'root'
})
export class DoughnutChartFactoryService extends ChartFactory {

    constructor() {

        super('doughnut');
    }

    protected configureDataSet(data: IChartData): ChartDataSets {

        const dataSet: ChartDataSets = {

            data: data.values,
            borderWidth: [1]
        };

        return this.setColor(dataSet, data.mainRgb, data.labels.length);
    }

    private addPercentage(

        item: ChartTooltipItem,
        data: ChartData,
        sum: (values: number[]) => number

    ): string {

        const dataSet = data.datasets[item.datasetIndex];
        const label = data.labels[item.index];
        const current = <number>dataSet.data[item.index];
        const total = sum(<number[]>dataSet.data);

        return `${label} ${(current / total * 100).toFixed(1)}%`;
    }

    protected configureOptions(data: IChartData): ChartOptions {

        const legend = { display: false };
        const title = { display: true, text: data.title };

        const sum = (values: number[]) => {

            return values.reduce((total, current) => total + current);
        };

        const callback = (item, chartData) => {

            return this.addPercentage(item, chartData, sum);
        };

        return <ChartOptions>{

            cutoutPercentage: 25,
            legend,
            title,
            tooltips: { callbacks: { label: callback } }
        };
    }
}
