import { IChartData } from './chartData.interface';
import { Chart, ChartDataSets, ChartOptions } from 'chart.js';

export abstract class ChartFactory {

    constructor(protected type: string) { }

    protected getRandomValue(min: number = 0, max: number = 255): number {

        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    protected getRandomRgb(min: number = 0, max: number = 255): { r, g, b } {

        return {

            r: this.getRandomValue(min, max),
            g: this.getRandomValue(min, max),
            b: this.getRandomValue(min, max)
        };
    }

    protected getColor(rgb: { r, g, b }, alpha: number = 1): string {

        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
    }

    protected getRandomColors(

        total: number,
        min: number = 0,
        max: number = 255,
        alpha: number = 1

    ): string[] {

        const colors: string[] = [];

        for (let i = 0; i < total; i++) {

            const rgb = this.getRandomRgb(min, max);
            colors.push(this.getColor(rgb, alpha));
        }

        return colors;
    }

    protected setColor(

        dataSet: ChartDataSets,
        rgb: { r, g, b },
        total: number = 1

    ): ChartDataSets {

        const mainColors = new Array(total).fill(this.getColor(rgb, 0.7));
        const randomColors = this.getRandomColors(total);

        dataSet.backgroundColor = randomColors;
        dataSet.borderColor = randomColors;
        dataSet.hoverBackgroundColor = mainColors;
        dataSet.hoverBorderColor = mainColors;

        return dataSet;
    }

    public clear(chart: Chart): void {

        if (chart) {

            chart.destroy();
        }
    }

    protected abstract configureDataSet(data: IChartData): ChartDataSets;

    protected abstract configureOptions(data: IChartData): ChartOptions;

    public create(data: IChartData): Chart {

        return new Chart(data.canvas, {

            type: this.type,
            data: {

                labels: data.labels,
                datasets: [this.configureDataSet(data)]
            },
            options: this.configureOptions(data)
        });
    }
}
