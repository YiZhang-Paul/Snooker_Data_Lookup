export interface IChartData {

    readonly canvas: string;
    readonly title: string;
    readonly labels: string[];
    readonly values: number[];
    readonly mainRgb: { r, g, b };
}
