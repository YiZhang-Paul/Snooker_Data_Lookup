import { Component, OnInit, Inject } from '@angular/core';
import { PlayerAllStatisticsCalculatorService } from '../../data-providers/players-data/player-all-statistics-calculator.service';
import { DoughnutChartFactoryService } from '../../../shared/services/doughnut-chart-factory.service';
import { APP_CONFIG } from '../../../app-config';

@Component({
    selector: 'app-player-all-stats',
    templateUrl: './player-all-stats.component.html',
    styleUrls: ['./player-all-stats.component.css']
})
export class PlayerAllStatsComponent implements OnInit {

    private _year = -1;
    private _nationalityChart: Chart;
    private _ageChart: Chart;
    private _statusChart: Chart;
    private _earningsChart: Chart;

    constructor(

        @Inject(APP_CONFIG) private configuration,
        private statistics: PlayerAllStatisticsCalculatorService,
        private doughnutChartFactory: DoughnutChartFactoryService

    ) { }

    get selectedYear(): number {

        return this._year;
    }

    get years(): number[] {

        const startYear = this.configuration.startYear;
        const currentYear = new Date().getFullYear();
        const totalYears = currentYear - startYear + 1;
        const result = new Array(totalYears + 1).fill(-1);

        return result.map((year, index) => {

            return index ? startYear + (index - 1) : -1;
        });
    }

    ngOnInit() {

        this.loadCharts(this._year);
    }

    private loadNationalityChart(year: number): void {

        this.statistics.groupByNationality(year).subscribe(percentages => {

            this.doughnutChartFactory.clear(this._nationalityChart);

            this._nationalityChart = this.doughnutChartFactory.create({

                canvas: 'nationalityCanvas',
                title: 'Nationalities',
                labels: percentages.map(percentage => percentage.key),
                values: percentages.map(percentage => percentage.size),
                mainRgb: { r: 255, g: 99, b: 132 }
            });
        });
    }

    private loadAgeChart(year: number): void {

        this.statistics.groupByAge(year).subscribe(percentages => {

            this.doughnutChartFactory.clear(this._ageChart);

            this._ageChart = this.doughnutChartFactory.create({

                canvas: 'ageCanvas',
                title: 'Age Groups',
                labels: percentages.map(percentage => `${percentage.key}-${percentage.key + 10}`),
                values: percentages.map(percentage => percentage.size),
                mainRgb: { r: 255, g: 99, b: 132 }
            });
        });
    }

    private loadStatusChart(year: number): void {

        this.statistics.groupByStatus(year).subscribe(percentages => {

            this.doughnutChartFactory.clear(this._statusChart);

            this._statusChart = this.doughnutChartFactory.create({

                canvas: 'statusCanvas',
                title: 'Active/Retired',
                labels: percentages.map(percentage => percentage.key ? 'Active' : 'Retired'),
                values: percentages.map(percentage => percentage.size),
                mainRgb: { r: 255, g: 99, b: 132 }
            });
        });
    }

    private loadEarningsChart(year: number): void {

        this.statistics.groupByEarnings(year).subscribe(percentages => {

            this.doughnutChartFactory.clear(this._earningsChart);

            this._earningsChart = this.doughnutChartFactory.create({

                canvas: 'earningsCanvas',
                title: 'Earnings',
                labels: percentages.map(percentage => `${percentage.key}-${percentage.key + 400000}`),
                values: percentages.map(percentage => percentage.size),
                mainRgb: { r: 255, g: 99, b: 132 }
            });
        });
    }

    private loadCharts(year: number): void {

        this.loadNationalityChart(year);
        this.loadAgeChart(year);
        this.loadStatusChart(year);
        this.loadEarningsChart(year);
    }

    public onYearSelected(year: string): void {

        this._year = Number(year);
        this.loadCharts(this._year);
    }
}
