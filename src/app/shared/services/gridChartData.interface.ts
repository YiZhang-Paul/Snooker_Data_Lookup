import { IChartData } from './chartData.interface';

export interface IGridChartData extends IChartData {

    readonly gridRgb: { r, g, b };
}
